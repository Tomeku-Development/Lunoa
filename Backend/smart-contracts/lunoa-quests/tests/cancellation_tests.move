#[test_only]
module LunoaQuests::cancellation_tests {

    use aptos_framework::account;
    use aptos_framework::aptos_coin;
    use std::signer;
    use std::string;
    use LunoaQuests::quests;
    use LunoaQuests::lunoa_coin;
    use aptos_framework::coin;

    const E_NOT_CREATOR: u64 = 7;
    const E_QUEST_HAS_PARTICIPANTS: u64 = 8;

    // Helper to initialize the test environment
    fun setup_test(aptos_framework: &signer, contract_owner: &signer, creator: &signer) {
        account::create_account_for_test(signer::address_of(contract_owner));
        account::create_account_for_test(signer::address_of(creator));

        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
        lunoa_coin::init_for_test(contract_owner);
        quests::test_init(contract_owner);

        lunoa_coin::register(creator);
    }

    #[test(aptos_framework = @aptos_framework, contract_owner = @LunoaQuests, creator = @0x123)]
    fun test_cancel_quest_success(aptos_framework: &signer, contract_owner: &signer, creator: &signer) {
        setup_test(aptos_framework, contract_owner, creator);

        let creator_addr = signer::address_of(creator);
        let reward_amount = 100;
        lunoa_coin::mint(contract_owner, creator_addr, reward_amount);
        assert!(coin::balance<lunoa_coin::LunoaCoin>(creator_addr) == reward_amount, 1);

        // Create a quest
        quests::create_quest(
            creator, 
            string::utf8(b"Cancellable Quest"), 
            string::utf8(b"A quest to be canceled"), 
            reward_amount
        );

        // The reward is transferred to the treasury
        assert!(coin::balance<lunoa_coin::LunoaCoin>(creator_addr) == 0, 2);

        // Cancel the quest
        let quest_id = 0;
        quests::cancel_quest(creator, quest_id);

        // The reward should be refunded
        assert!(coin::balance<lunoa_coin::LunoaCoin>(creator_addr) == reward_amount, 3);
    }

    #[test(aptos_framework = @aptos_framework, contract_owner = @LunoaQuests, creator = @0x123, non_creator = @0x456)]
    #[expected_failure(abort_code = E_NOT_CREATOR, location = LunoaQuests::quests)]
    fun test_cancel_quest_fail_not_creator(aptos_framework: &signer, contract_owner: &signer, creator: &signer, non_creator: &signer) {
        setup_test(aptos_framework, contract_owner, creator);
        account::create_account_for_test(signer::address_of(non_creator));

        let reward_amount = 100;
        lunoa_coin::mint(contract_owner, signer::address_of(creator), reward_amount);

        // Create a quest
        quests::create_quest(
            creator, 
            string::utf8(b"Test Quest"), 
            string::utf8(b"..."), 
            reward_amount
        );

        // Attempt to cancel with the wrong account
        let quest_id = 0;
        quests::cancel_quest(non_creator, quest_id);
    }

}
