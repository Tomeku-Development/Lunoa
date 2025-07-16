#[test_only]
module LunoaQuests::quests_tests {

    use aptos_framework::account;
    use aptos_framework::aptos_coin;
    use std::signer;
    use std::string;
    use LunoaQuests::quests;
    use LunoaQuests::lunoa_coin;
    use aptos_framework::coin;

    #[test(aptos_framework = @aptos_framework, contract_owner = @LunoaQuests, creator = @0x123)]
    fun test_create_quest_success(aptos_framework: &signer, contract_owner: &signer, creator: &signer) {
        // The contract owner must have an account to publish the module.
        account::create_account_for_test(signer::address_of(contract_owner));

        // The creator also needs an account to interact with the contract.
        account::create_account_for_test(signer::address_of(creator));

        // Initialize the modules.
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
        lunoa_coin::init_for_test(contract_owner);
        quests::test_init(contract_owner);

        // The creator needs funds to create a quest.
        lunoa_coin::register(creator);
        lunoa_coin::mint(contract_owner, signer::address_of(creator), 1000);

        // Define quest parameters
        let title = std::string::utf8(b"Test Quest");
        let description = std::string::utf8(b"This is a test quest.");
        let reward_amount = 100;

        // Call the create_quest function
        quests::create_quest(creator, title, description, reward_amount);

        // NOTE: Further assertions would require view functions to inspect the state.
        // For now, a successful execution of create_quest is the test.
    }

    #[test(aptos_framework = @aptos_framework, contract_owner = @LunoaQuests, creator = @0x123, participant = @0x456)]
    fun test_join_quest_success(aptos_framework: &signer, contract_owner: &signer, creator: &signer, participant: &signer) {
        // Setup accounts
        account::create_account_for_test(signer::address_of(contract_owner));
        account::create_account_for_test(signer::address_of(creator));
        account::create_account_for_test(signer::address_of(participant));

        // Initialize the modules
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
        lunoa_coin::init_for_test(contract_owner);
        quests::test_init(contract_owner);

        // Setup coin for creator
        lunoa_coin::register(creator);
        lunoa_coin::mint(contract_owner, signer::address_of(creator), 1000);

        // Create a quest
        let title = std::string::utf8(b"Joinable Quest");
        let description = std::string::utf8(b"A quest to be joined");
        quests::create_quest(creator, title, description, 100);

        // Join the quest
        let quest_id = 0;
        quests::join_quest(participant, quest_id);

        // Verify the participant's status
        let participant_addr = signer::address_of(participant);
        let status = quests::get_quest_participant_status(quest_id, participant_addr);
        assert!(status == string::utf8(b"joined"), 1);
    }

    #[test(aptos_framework = @aptos_framework, contract_owner = @LunoaQuests, creator = @0x123, participant = @0x456)]
    fun test_complete_quest_success(aptos_framework: &signer, contract_owner: &signer, creator: &signer, participant: &signer) {
        // --- Setup ---
        account::create_account_for_test(signer::address_of(contract_owner));
        account::create_account_for_test(signer::address_of(creator));
        account::create_account_for_test(signer::address_of(participant));

        // Initialize modules
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
        lunoa_coin::init_for_test(contract_owner);
        quests::test_init(contract_owner);

        // Setup accounts to hold LunoaCoin
        lunoa_coin::register(creator);
        lunoa_coin::register(participant);

        // Give the creator funds to create the quest
        let reward_amount = 100;
        lunoa_coin::mint(contract_owner, signer::address_of(creator), reward_amount);
        assert!(coin::balance<lunoa_coin::LunoaCoin>(signer::address_of(creator)) == reward_amount, 1);

        // --- Action ---
        // Create a quest
        quests::create_quest(
            creator, 
            string::utf8(b"Completable Quest"), 
            string::utf8(b"A quest to be completed"), 
            reward_amount
        );

        // Join the quest
        let quest_id = 0;
        quests::join_quest(participant, quest_id);

        // Complete the quest
        quests::complete_quest(participant, quest_id);

        // --- Assertions ---
        let participant_addr = signer::address_of(participant);
        // Verify status is updated
        let status = quests::get_quest_participant_status(quest_id, participant_addr);
        assert!(status == string::utf8(b"submitted"), 2);

        // Verify the creator's balance is now 0
        assert!(coin::balance<lunoa_coin::LunoaCoin>(signer::address_of(creator)) == 0, 3);

        // Verify the participant received the reward
        assert!(coin::balance<lunoa_coin::LunoaCoin>(participant_addr) == reward_amount, 4);
    }
}
