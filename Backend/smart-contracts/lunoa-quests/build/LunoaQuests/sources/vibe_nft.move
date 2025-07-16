// Lunoa Vibe NFT Smart Contract
//
// This contract manages the creation and ownership of Vibe NFTs, 
// following the Aptos Object model.

// Lunoa Vibe NFT Smart Contract
//
// This contract manages the creation and ownership of Vibe NFTs,
// following the Aptos Object model.

module LunoaQuests::vibe_nft {
    use std::string::String;
    use std::signer;
    use aptos_framework::object::{Self, Object};
    use aptos_token_objects::collection;
    use aptos_token_objects::royalty;
    use aptos_token_objects::token;
    use std::option;

    /// The collection does not exist
    const ECOLLECTION_DOES_NOT_EXIST: u64 = 1;

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    /// Represents a collection of Vibe NFTs.
    struct VibeCollection has key {}

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    /// Represents a single Vibe NFT.
    struct VibeNft has key {}

    /// Create a new collection for Vibe NFTs.
    public entry fun create_vibe_collection(
        creator: &signer,
        description: String,
        name: String,
        uri: String,
    ) {
        collection::create_unlimited_collection(
            creator,
            description,
            name,
            option::none<royalty::Royalty>(),
            uri,
        );
        move_to(creator, VibeCollection {});
    }

    /// Mint a new Vibe NFT and transfer it to a recipient.
    public entry fun mint_vibe_nft(
        creator: &signer,
        collection_name: String,
        description: String,
        name: String,
        uri: String,
        recipient: address,
    ) {
        assert!(exists<VibeCollection>(signer::address_of(creator)), ECOLLECTION_DOES_NOT_EXIST);

        let token_constructor_ref = token::create(
            creator,
            collection_name,
            description,
            name,
            option::none(),
            uri,
        );

        // Attach our VibeNft resource to the token object
        let token_signer = object::generate_signer(&token_constructor_ref);
        move_to(&token_signer, VibeNft {});

        // Transfer the token to the recipient
        let token_object: Object<VibeNft> = object::object_from_constructor_ref(&token_constructor_ref);
        object::transfer(creator, token_object, recipient);
    }
}
