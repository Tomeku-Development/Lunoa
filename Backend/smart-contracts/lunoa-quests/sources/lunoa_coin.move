/// A simple managed coin for testing the Lunoa quests contract.
/// In a production environment, this would be replaced by the official $Lunoa token.
module LunoaQuests::lunoa_coin {



    use aptos_framework::managed_coin;

    /// The Lunoa Coin struct. This is an empty struct because the actual coin data
    /// is managed by the coin module.
    struct LunoaCoin {}



    /// The module initializer. It's called by the account that deploys the module.
    /// This function registers the coin, granting the deployer the initial capabilities
    /// to mint and burn the coin.
    fun init_module(sender: &signer) {
        managed_coin::initialize<LunoaCoin>(
            sender,
            b"Lunoa Test Coin",
            b"LTC",
            6,
            false, // Not freezable
        );
    }

    // Public functions to allow other modules (like our tests) to interact with the coin.

    public fun mint(minter: &signer, dst_addr: address, amount: u64) {
        managed_coin::mint<LunoaCoin>(minter, dst_addr, amount);
    }

    public fun burn(burner: &signer, amount: u64) {
        managed_coin::burn<LunoaCoin>(burner, amount);
    }

    public fun register(account: &signer) {
        managed_coin::register<LunoaCoin>(account);
    }

    #[test_only]
    public fun init_for_test(sender: &signer) {
        managed_coin::initialize<LunoaCoin>(
            sender,
            b"Lunoa Test Coin",
            b"LTC",
            6,
            false, // Not freezable
        );
    }
}
