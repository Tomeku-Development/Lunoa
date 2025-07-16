#[test_only]
module LunoaQuests::vibe_nft_tests {
    use std::signer;
    use std::string;
    use aptos_framework::account;
    use aptos_framework::object::{self, Object};
    use aptos_token_objects::token;
    use aptos_token_objects::collection;
    use LunoaQuests::vibe_nft;

    const ECOLLECTION_DOES_NOT_EXIST: u64 = 1;

    #[test(creator = @0x123)]
    fun test_create_vibe_collection_success(creator: &signer) {
        let creator_addr = signer::address_of(creator);
        account::create_account_for_test(creator_addr);

        let collection_name = string::utf8(b"Test Collection");

        vibe_nft::create_vibe_collection(
            creator,
            string::utf8(b"Test Description"),
            collection_name,
            string::utf8(b"https://example.com/collection"),
        );

        let collection_addr = collection::create_collection_address(&creator_addr, &collection_name);
        assert!(exists<vibe_nft::VibeCollection>(collection_addr), ECOLLECTION_DOES_NOT_EXIST);
    }

    #[test(creator = @0x123, recipient = @0x456)]
    fun test_mint_vibe_nft_success(creator: &signer, recipient: &signer) {
        let creator_addr = signer::address_of(creator);
        let recipient_addr = signer::address_of(recipient);
        account::create_account_for_test(creator_addr);
        account::create_account_for_test(recipient_addr);

        let collection_name = string::utf8(b"Test Collection");
        let nft_name = string::utf8(b"Test NFT");

        // 1. Create the collection
        vibe_nft::create_vibe_collection(
            creator,
            string::utf8(b"Test Description"),
            collection_name,
            string::utf8(b"https://example.com/collection"),
        );

        // 2. Mint the NFT to the recipient
        vibe_nft::mint_vibe_nft(
            creator,
            collection_name,
            string::utf8(b"Test NFT Description"),
            nft_name,
            string::utf8(b"https://example.com/nft"),
            recipient_addr,
        );

        // 3. Verify the recipient is the owner
        let token_seed = token::create_token_seed(&nft_name);
        let token_addr = object::create_object_address(&creator_addr, token_seed);
        let token_obj: Object<vibe_nft::VibeNft> = object::address_to_object(token_addr);

        assert!(object::owner(token_obj) == recipient_addr, 1);
    }
}
