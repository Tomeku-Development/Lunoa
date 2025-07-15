#[test_only]
module LunoaQuests::quests_tests {

    use aptos_framework::account;
    use std::signer;
    use std::string;
    use LunoaQuests::quests;

    #[test(contract_owner = @LunoaQuests, creator = @0x123)]
    fun test_create_quest_success(contract_owner: &signer, creator: &signer) {
        // The contract owner must have an account to publish the module.
        account::create_account_for_test(signer::address_of(contract_owner));

        // The creator also needs an account to interact with the contract.
        account::create_account_for_test(signer::address_of(creator));

        // Initialize the module using the contract owner's signer.
        quests::test_init(contract_owner);

        // Define quest parameters
        let title = std::string::utf8(b"Test Quest");
        let description = std::string::utf8(b"This is a test quest.");
        let reward_amount = 100;

        // Call the create_quest function
        quests::create_quest(creator, title, description, reward_amount);

        // NOTE: Further assertions would require view functions to inspect the state.
        // For now, a successful execution of create_quest is the test.
    }

    #[test(contract_owner = @LunoaQuests, creator = @0x123, participant = @0x456)]
    fun test_join_quest_success(contract_owner: &signer, creator: &signer, participant: &signer) {
        // Setup accounts
        account::create_account_for_test(signer::address_of(contract_owner));
        account::create_account_for_test(signer::address_of(creator));
        account::create_account_for_test(signer::address_of(participant));

        // Initialize the module
        quests::test_init(contract_owner);

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

    #[test(contract_owner = @LunoaQuests, creator = @0x123, participant = @0x456)]
    fun test_complete_quest_success(contract_owner: &signer, creator: &signer, participant: &signer) {
        // Setup accounts
        account::create_account_for_test(signer::address_of(contract_owner));
        account::create_account_for_test(signer::address_of(creator));
        account::create_account_for_test(signer::address_of(participant));

        // Initialize the module
        quests::test_init(contract_owner);

        // Create a quest
        let title = std::string::utf8(b"Completable Quest");
        let description = std::string::utf8(b"A quest to be completed");
        quests::create_quest(creator, title, description, 100);

        // Join the quest
        let quest_id = 0;
        quests::join_quest(participant, quest_id);

        // Complete the quest
        quests::complete_quest(participant, quest_id);

        // Verify the participant's status is now 'submitted'
        let participant_addr = signer::address_of(participant);
        let status = quests::get_quest_participant_status(quest_id, participant_addr);
        assert!(status == string::utf8(b"submitted"), 2);
    }
}
