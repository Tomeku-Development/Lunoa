// Lunoa Quests Smart Contract
//
// This contract manages the lifecycle of quests on the Lunoa platform,
// including creation, participation, and reward distribution.

module LunoaQuests::quests {
    friend LunoaQuests::quests_tests;
    use std::string::{Self, String};
    use std::signer;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_std::table::{Self, Table};

    /// The Lunoa token.
    struct LunoaCoin {}

    /// A quest managed by the contract.
    struct Quest has store {
        id: u64,
        creator: address,
        title: String,
        description: String,
        reward_amount: u64,
        is_active: bool,
        participants: Table<address, String> // Participant address to status ("joined", "submitted", etc.)
    }

    /// Resource to store all quests in a central table.
    struct QuestStore has key {
        quests: Table<u64, Quest>,
        next_quest_id: u64,
        quest_created_events: event::EventHandle<QuestCreatedEvent>,
        quest_joined_events: event::EventHandle<QuestJoinedEvent>,
        quest_completed_events: event::EventHandle<QuestCompletedEvent>,
    }

    /// Event emitted when a new quest is created.
    struct QuestCreatedEvent has store, drop {
        quest_id: u64,
        creator: address,
        title: String,
        reward: u64,
    }

    /// Event emitted when a quest is completed and rewards are claimed.
    struct QuestCompletedEvent has store, drop {
        quest_id: u64,
        completer: address,
        reward_paid: u64,
    }

    /// Event emitted when a user joins a quest.
    struct QuestJoinedEvent has store, drop {
        quest_id: u64,
        participant: address,
    }

    /// The module initializer is called once when the module is published.
    /// It creates the central QuestStore resource.
    fun init_module(sender: &signer) {
        move_to(sender, QuestStore {
            quests: table::new(),
            next_quest_id: 0,
            quest_created_events: account::new_event_handle<QuestCreatedEvent>(sender),
            quest_joined_events: account::new_event_handle<QuestJoinedEvent>(sender),
            quest_completed_events: account::new_event_handle<QuestCompletedEvent>(sender),
        });
    }

    /// Creates a new quest.
    /// Creates a new quest. The creator must deposit the reward amount into the contract.
    public entry fun create_quest(creator: &signer, title: String, description: String, reward_amount: u64) acquires QuestStore {
        // Placeholder: In a real scenario, you'd transfer `reward_amount` of LunoaCoin 
        // from the creator to a contract-owned vault.
        // coin::transfer<LunoaCoin>(creator, signer::address_of(borrow_global<QuestStore>(@LunoaQuests)), reward_amount);

        let creator_addr = signer::address_of(creator);
        let quest_store = borrow_global_mut<QuestStore>(@LunoaQuests);

        let quest_id = quest_store.next_quest_id;
        let new_quest = Quest {
            id: quest_id,
            creator: creator_addr,
            title: title,
            description: description,
            reward_amount: reward_amount,
            is_active: true,
            participants: table::new(),
        };

        table::add(&mut quest_store.quests, quest_id, new_quest);
        quest_store.next_quest_id = quest_store.next_quest_id + 1;

        event::emit_event(
            &mut quest_store.quest_created_events,
            QuestCreatedEvent {
                quest_id: quest_id,
                creator: creator_addr,
                title: title,
                reward: reward_amount,
            }
        );
    }

    /// Allows a user to join an active quest.
    public entry fun join_quest(joiner: &signer, quest_id: u64) acquires QuestStore {
        let joiner_addr = signer::address_of(joiner);
        let quest_store = borrow_global_mut<QuestStore>(@LunoaQuests);

        assert!(table::contains(&quest_store.quests, quest_id), 1); // E_QUEST_NOT_FOUND

        let quest = table::borrow_mut(&mut quest_store.quests, quest_id);

        assert!(quest.is_active, 2); // E_QUEST_NOT_ACTIVE
        assert!(quest.creator != joiner_addr, 3); // E_CREATOR_CANNOT_JOIN
        assert!(!table::contains(&quest.participants, joiner_addr), 4); // E_ALREADY_JOINED

        table::add(&mut quest.participants, joiner_addr, string::utf8(b"joined"));

        event::emit_event(
            &mut quest_store.quest_joined_events,
            QuestJoinedEvent {
                quest_id: quest_id,
                participant: joiner_addr,
            }
        );
    }

    /// Allows a participant to complete a quest and claim the reward.
    public entry fun complete_quest(completer: &signer, quest_id: u64) acquires QuestStore {
        let completer_addr = signer::address_of(completer);
        let quest_store = borrow_global_mut<QuestStore>(@LunoaQuests);

        assert!(table::contains(&quest_store.quests, quest_id), 1); // E_QUEST_NOT_FOUND

        let quest = table::borrow_mut(&mut quest_store.quests, quest_id);

        assert!(quest.is_active, 2); // E_QUEST_NOT_ACTIVE
        assert!(table::contains(&quest.participants, completer_addr), 5); // E_NOT_A_PARTICIPANT

        let participant_status = table::borrow_mut(&mut quest.participants, completer_addr);
        assert!(*participant_status == string::utf8(b"joined"), 6); // E_COMPLETION_ALREADY_SUBMITTED

        // Update status to submitted
        *participant_status = string::utf8(b"submitted");

        // Transfer reward
        // In a real implementation, the contract would hold the funds in escrow and transfer from its own account.
        // This requires a treasury/vault pattern, which is a more advanced topic.
        // coin::transfer<LunoaCoin>(&contract_signer, completer_addr, quest.reward_amount);


        event::emit_event(
            &mut quest_store.quest_completed_events,
            QuestCompletedEvent {
                quest_id: quest_id,
                completer: completer_addr,
                reward_paid: quest.reward_amount,
            }
        );
    }

    #[test_only]
    public(friend) fun test_init(sender: &signer) {
        init_module(sender)
    }

    #[test_only]
    public(friend) fun get_quest_participant_status(quest_id: u64, participant_addr: address): String acquires QuestStore {
        let quest_store = borrow_global<QuestStore>(@LunoaQuests);
        let quest = table::borrow(&quest_store.quests, quest_id);
        let participant_status = table::borrow(&quest.participants, participant_addr);
        *participant_status
    }
}
