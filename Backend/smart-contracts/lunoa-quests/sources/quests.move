// Lunoa Quests Smart Contract
//
// This contract manages the lifecycle of quests on the Lunoa platform,
// including creation, participation, and reward distribution.

module LunoaQuests::quests {
    #[test_only]
    friend LunoaQuests::quests_tests;
    #[test_only]
    friend LunoaQuests::cancellation_tests;
    use std::string::{Self, String};
    use std::signer;
    use aptos_framework::account;
    use aptos_framework::coin;
    use aptos_framework::event;

    use aptos_framework::table::{Self, Table};
    use LunoaQuests::lunoa_coin::{Self, LunoaCoin};



    /// A quest managed by the contract.
    struct Quest has store {
        id: u64,
        creator: address,
        title: String,
        description: String,
        reward_amount: u64,
        status: String, // "active", "completed", "canceled"
        participants: Table<address, String> // Participant address to status ("joined", "submitted", etc.)
    }

    /// Resource to hold the contract's SignerCapability.
    struct Treasury has key {
        signer_cap: account::SignerCapability,
    }

    /// Resource to store all quests in a central table.
    struct QuestStore has key {
        quests: Table<u64, Quest>,
        next_quest_id: u64,
        quest_created_events: event::EventHandle<QuestCreatedEvent>,
        quest_joined_events: event::EventHandle<QuestJoinedEvent>,
        quest_completed_events: event::EventHandle<QuestCompletedEvent>,
        quest_canceled_events: event::EventHandle<QuestCanceledEvent>,
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

    /// Event emitted when a quest is canceled.
    struct QuestCanceledEvent has store, drop {
        quest_id: u64,
        creator: address,
    }

    /// The module initializer is called once when the module is published.
    /// It creates the central QuestStore resource.
    fun init_module(sender: &signer) {
        // Create a resource account for the contract itself to hold the treasury.
        let seed = b"lunoa_quests_treasury_seed";
        let (resource_signer, resource_signer_cap) = account::create_resource_account(sender, seed);



        // Register the resource account for LunoaCoin.
        lunoa_coin::register(&resource_signer);

        // The SignerCapability is stored in the Treasury resource.
        move_to(sender, Treasury { signer_cap: resource_signer_cap });

        move_to(sender, QuestStore {
            quests: table::new(),
            next_quest_id: 0,
            quest_created_events: account::new_event_handle<QuestCreatedEvent>(sender),
            quest_joined_events: account::new_event_handle<QuestJoinedEvent>(sender),
            quest_completed_events: account::new_event_handle<QuestCompletedEvent>(sender),
            quest_canceled_events: account::new_event_handle<QuestCanceledEvent>(sender),
        });
    }

    /// Creates a new quest.
    /// Creates a new quest. The creator must deposit the reward amount into the contract.
    public entry fun create_quest(creator: &signer, title: String, description: String, reward_amount: u64) acquires QuestStore {
        // The creator must deposit the reward into the contract's treasury.
        let module_owner_addr = @LunoaQuests;
        let treasury_addr = account::create_resource_address(&module_owner_addr, b"lunoa_quests_treasury_seed");
        coin::transfer<LunoaCoin>(creator, treasury_addr, reward_amount);

        let creator_addr = signer::address_of(creator);
        let quest_store = borrow_global_mut<QuestStore>(@LunoaQuests);

        let quest_id = quest_store.next_quest_id;
        let new_quest = Quest {
            id: quest_id,
            creator: creator_addr,
            title: title,
            description: description,
            reward_amount: reward_amount,
            status: string::utf8(b"active"),
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

        assert!(quest.status == string::utf8(b"active"), 2); // E_QUEST_NOT_ACTIVE
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
    public entry fun complete_quest(completer: &signer, quest_id: u64) acquires QuestStore, Treasury {
        let completer_addr = signer::address_of(completer);
        let quest_store = borrow_global_mut<QuestStore>(@LunoaQuests);

        assert!(table::contains(&quest_store.quests, quest_id), 1); // E_QUEST_NOT_FOUND

        let quest = table::borrow_mut(&mut quest_store.quests, quest_id);

        assert!(quest.status == string::utf8(b"active"), 2); // E_QUEST_NOT_ACTIVE
        assert!(table::contains(&quest.participants, completer_addr), 5); // E_NOT_A_PARTICIPANT

        let participant_status = table::borrow_mut(&mut quest.participants, completer_addr);
        assert!(*participant_status == string::utf8(b"joined"), 6); // E_COMPLETION_ALREADY_SUBMITTED

        // Update status to submitted
        *participant_status = string::utf8(b"submitted");

        // Transfer reward
        // Get the contract's signer capability to authorize the transfer.
        let treasury = borrow_global<Treasury>(@LunoaQuests);
        let contract_signer = account::create_signer_with_capability(&treasury.signer_cap);

        // Transfer the reward from the contract's treasury to the completer.
        coin::transfer<LunoaCoin>(&contract_signer, completer_addr, quest.reward_amount);


        event::emit_event(
            &mut quest_store.quest_completed_events,
            QuestCompletedEvent {
                quest_id: quest_id,
                completer: completer_addr,
                reward_paid: quest.reward_amount,
            }
        );
    }

    /// Allows the creator of a quest to cancel it and receive a refund,
    /// provided no one has joined the quest yet.
    public entry fun cancel_quest(creator: &signer, quest_id: u64) acquires QuestStore, Treasury {
        let creator_addr = signer::address_of(creator);
        let quest_store = borrow_global_mut<QuestStore>(@LunoaQuests);

        assert!(table::contains(&quest_store.quests, quest_id), 1); // E_QUEST_NOT_FOUND

        let quest = table::borrow_mut(&mut quest_store.quests, quest_id);

        assert!(quest.creator == creator_addr, 7); // E_NOT_CREATOR
        assert!(quest.status == string::utf8(b"active"), 2); // E_QUEST_NOT_ACTIVE
        // Update quest status
        quest.status = string::utf8(b"canceled");

        // Refund the reward to the creator
        let treasury = borrow_global<Treasury>(@LunoaQuests);
        let contract_signer = account::create_signer_with_capability(&treasury.signer_cap);
        coin::transfer<LunoaCoin>(&contract_signer, creator_addr, quest.reward_amount);

        event::emit_event(
            &mut quest_store.quest_canceled_events,
            QuestCanceledEvent {
                quest_id: quest_id,
                creator: creator_addr,
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
