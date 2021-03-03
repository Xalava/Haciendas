export default [
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "collateralType",
              "type": "address"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "modifiers",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes3",
                  "name": "primaryColor",
                  "type": "bytes3"
                },
                {
                  "internalType": "bytes3",
                  "name": "secondaryColor",
                  "type": "bytes3"
                },
                {
                  "internalType": "bytes3",
                  "name": "cheekColor",
                  "type": "bytes3"
                },
                {
                  "internalType": "uint8",
                  "name": "svgId",
                  "type": "uint8"
                },
                {
                  "internalType": "uint8",
                  "name": "eyeShapeSvgId",
                  "type": "uint8"
                },
                {
                  "internalType": "uint16",
                  "name": "conversionRate",
                  "type": "uint16"
                },
                {
                  "internalType": "bool",
                  "name": "delisted",
                  "type": "bool"
                }
              ],
              "internalType": "struct AavegotchiCollateralTypeInfo",
              "name": "collateralTypeInfo",
              "type": "tuple"
            }
          ],
          "indexed": false,
          "internalType": "struct IAavegotchiDiamond.AavegotchiCollateralTypeIO",
          "name": "_collateralType",
          "type": "tuple"
        }
      ],
      "name": "AddCollateralType",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "author",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "traitModifiers",
              "type": "uint256"
            },
            {
              "internalType": "uint8[]",
              "name": "allowedCollaterals",
              "type": "uint8[]"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint96",
              "name": "ghstPrice",
              "type": "uint96"
            },
            {
              "internalType": "uint32",
              "name": "svgId",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "maxQuantity",
              "type": "uint32"
            },
            {
              "internalType": "uint8",
              "name": "rarityScoreModifier",
              "type": "uint8"
            },
            {
              "internalType": "uint16",
              "name": "slotPositions",
              "type": "uint16"
            },
            {
              "internalType": "bool",
              "name": "canPurchaseWithGhst",
              "type": "bool"
            },
            {
              "internalType": "uint32",
              "name": "totalQuantity",
              "type": "uint32"
            },
            {
              "internalType": "uint8",
              "name": "minLevel",
              "type": "uint8"
            },
            {
              "internalType": "bool",
              "name": "canBeTransferred",
              "type": "bool"
            },
            {
              "internalType": "uint8",
              "name": "category",
              "type": "uint8"
            },
            {
              "internalType": "int8",
              "name": "kinshipBonus",
              "type": "int8"
            },
            {
              "internalType": "uint32",
              "name": "experienceBonus",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "dimensions",
              "type": "uint32"
            }
          ],
          "indexed": false,
          "internalType": "struct ItemType",
          "name": "_itemType",
          "type": "tuple"
        }
      ],
      "name": "AddItemType",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint8[]",
              "name": "allowedCollaterals",
              "type": "uint8[]"
            },
            {
              "internalType": "uint256",
              "name": "wearableIds",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "traitsBonuses",
              "type": "uint256"
            }
          ],
          "indexed": false,
          "internalType": "struct WearableSet",
          "name": "_wearableSet",
          "type": "tuple"
        }
      ],
      "name": "AddWearableSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "_approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_batchId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_numAavegotchisToPurchase",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_totalPrice",
          "type": "uint256"
        }
      ],
      "name": "BuyPortals",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "ClaimAavegotchi",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_hauntId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_hauntMaxSize",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_portalPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "_bodyColor",
          "type": "bytes32"
        }
      ],
      "name": "CreateHaunt",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousDao",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newDao",
          "type": "address"
        }
      ],
      "name": "DaoTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousDaoTreasury",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newDaoTreasury",
          "type": "address"
        }
      ],
      "name": "DaoTreasuryTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_reduceAmount",
          "type": "uint256"
        }
      ],
      "name": "DecreaseStake",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_oldWearables",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_newWearables",
          "type": "uint256"
        }
      ],
      "name": "EquipWearables",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_fromTokenId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_toTokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "experience",
          "type": "uint256"
        }
      ],
      "name": "ExperienceTransfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousGameManager",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newGameManager",
          "type": "address"
        }
      ],
      "name": "GameManagerTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "_tokenIds",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint32[]",
          "name": "_xpValues",
          "type": "uint32[]"
        }
      ],
      "name": "GrantExperience",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_stakeAmount",
          "type": "uint256"
        }
      ],
      "name": "IncreaseStake",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "_itemIds",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint32[]",
          "name": "_maxQuanities",
          "type": "uint32[]"
        }
      ],
      "name": "ItemTypeMaxQuantity",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_lockDuration",
          "type": "uint256"
        }
      ],
      "name": "LockAavegotchi",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "_tokenIds",
          "type": "uint256[]"
        }
      ],
      "name": "OpenPortals",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "_itemIds",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "_quantities",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_totalPrice",
          "type": "uint256"
        }
      ],
      "name": "PurchaseItemsWithGhst",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "_itemIds",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "_quantities",
          "type": "uint256[]"
        }
      ],
      "name": "PurchaseItemsWithVouchers",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_oldName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_newName",
          "type": "string"
        }
      ],
      "name": "SetAavegotchiName",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_batchId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "tokenIds",
          "type": "uint256[]"
        }
      ],
      "name": "SetBatchId",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "int8[4]",
          "name": "_values",
          "type": "int8[4]"
        }
      ],
      "name": "SpendSkillpoints",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "_ids",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "_values",
          "type": "uint256[]"
        }
      ],
      "name": "TransferBatch",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_fromContract",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_fromTokenId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_tokenTypeId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "TransferFromParent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "TransferSingle",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_toContract",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_toTokenId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_tokenTypeId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "TransferToParent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "_value",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "URI",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_oldModifiers",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_newModifiers",
          "type": "uint256"
        }
      ],
      "name": "UpdateCollateralModifiers",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "_itemIds",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "_quantities",
          "type": "uint256[]"
        }
      ],
      "name": "UseConsumables",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "batchId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "randomNumber",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_vrfTimeSet",
          "type": "uint256"
        }
      ],
      "name": "VrfBatchRandomNumber",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "_experience",
          "type": "uint32"
        }
      ],
      "name": "aavegotchiLevel",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "level_",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "aavegotchiNameAvailable",
      "outputs": [
        {
          "internalType": "bool",
          "name": "available_",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_approved",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "availableSkillPoints",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "bal_",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "balance_",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_owners",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_ids",
          "type": "uint256[]"
        }
      ],
      "name": "balanceOfBatch",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "bals",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_tokenContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "balanceOfToken",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_numericTraits",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "collateralType",
          "type": "address"
        }
      ],
      "name": "baseRarityScore",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "_rarityScore",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_ghst",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_setBatchId",
          "type": "bool"
        }
      ],
      "name": "buyPortals",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_newFee",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "_keyHash",
          "type": "bytes32"
        }
      ],
      "name": "changeVRFFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_option",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_stakeAmount",
          "type": "uint256"
        }
      ],
      "name": "claimAavegotchi",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "collateralBalance",
      "outputs": [
        {
          "internalType": "address",
          "name": "collateralType_",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "escrow_",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "balance_",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_collateralId",
          "type": "uint256"
        }
      ],
      "name": "collateralInfo",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "collateralType",
              "type": "address"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "modifiers",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes3",
                  "name": "primaryColor",
                  "type": "bytes3"
                },
                {
                  "internalType": "bytes3",
                  "name": "secondaryColor",
                  "type": "bytes3"
                },
                {
                  "internalType": "bytes3",
                  "name": "cheekColor",
                  "type": "bytes3"
                },
                {
                  "internalType": "uint8",
                  "name": "svgId",
                  "type": "uint8"
                },
                {
                  "internalType": "uint8",
                  "name": "eyeShapeSvgId",
                  "type": "uint8"
                },
                {
                  "internalType": "uint16",
                  "name": "conversionRate",
                  "type": "uint16"
                },
                {
                  "internalType": "bool",
                  "name": "delisted",
                  "type": "bool"
                }
              ],
              "internalType": "struct AavegotchiCollateralTypeInfo",
              "name": "collateralTypeInfo",
              "type": "tuple"
            }
          ],
          "internalType": "struct IAavegotchiDiamond.AavegotchiCollateralTypeIO",
          "name": "collateralInfo_",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint24",
          "name": "_hauntMaxSize",
          "type": "uint24"
        },
        {
          "internalType": "uint96",
          "name": "_portalPrice",
          "type": "uint96"
        },
        {
          "internalType": "bytes3",
          "name": "_bodyColor",
          "type": "bytes3"
        }
      ],
      "name": "createHaunt",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "hauntId_",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentHaunt",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "hauntId_",
          "type": "uint16"
        },
        {
          "components": [
            {
              "internalType": "uint24",
              "name": "hauntMaxSize",
              "type": "uint24"
            },
            {
              "internalType": "uint96",
              "name": "portalPrice",
              "type": "uint96"
            },
            {
              "internalType": "bytes3",
              "name": "bodyColor",
              "type": "bytes3"
            },
            {
              "internalType": "uint24",
              "name": "totalCount",
              "type": "uint24"
            }
          ],
          "internalType": "struct Haunt",
          "name": "haunt_",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_toId",
          "type": "uint256"
        }
      ],
      "name": "decreaseAndDestroy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_reduceAmount",
          "type": "uint256"
        }
      ],
      "name": "decreaseStake",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "drawRandomNumber",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_equippedWearables",
          "type": "uint256"
        }
      ],
      "name": "equipWearables",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "equippedWearables",
      "outputs": [
        {
          "internalType": "uint256[16]",
          "name": "wearableIds_",
          "type": "uint256[16]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "gameManager",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "getAavegotchi",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "randomNumber",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "status",
              "type": "uint256"
            },
            {
              "internalType": "int256[]",
              "name": "numericTraits",
              "type": "int256[]"
            },
            {
              "internalType": "uint256[16]",
              "name": "equippedWearables",
              "type": "uint256[16]"
            },
            {
              "internalType": "address",
              "name": "collateral",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "escrow",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "stakedAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "minimumStake",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "kinship",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lastInteracted",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "experience",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "usedSkillPoints",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "level",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "batchId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "hauntId",
              "type": "uint256"
            }
          ],
          "internalType": "struct IAavegotchiDiamond.AavegotchiInfo",
          "name": "aavegotchiInfo_",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "getAavegotchiSvg",
      "outputs": [
        {
          "internalType": "string",
          "name": "ag_",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "approved_",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_itemId",
          "type": "uint256"
        }
      ],
      "name": "getItemType",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "author",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "traitModifiers",
              "type": "uint256"
            },
            {
              "internalType": "uint8[]",
              "name": "allowedCollaterals",
              "type": "uint8[]"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint96",
              "name": "ghstPrice",
              "type": "uint96"
            },
            {
              "internalType": "uint32",
              "name": "svgId",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "maxQuantity",
              "type": "uint32"
            },
            {
              "internalType": "uint8",
              "name": "rarityScoreModifier",
              "type": "uint8"
            },
            {
              "internalType": "uint16",
              "name": "slotPositions",
              "type": "uint16"
            },
            {
              "internalType": "bool",
              "name": "canPurchaseWithGhst",
              "type": "bool"
            },
            {
              "internalType": "uint32",
              "name": "totalQuantity",
              "type": "uint32"
            },
            {
              "internalType": "uint8",
              "name": "minLevel",
              "type": "uint8"
            },
            {
              "internalType": "bool",
              "name": "canBeTransferred",
              "type": "bool"
            },
            {
              "internalType": "uint8",
              "name": "category",
              "type": "uint8"
            },
            {
              "internalType": "int8",
              "name": "kinshipBonus",
              "type": "int8"
            },
            {
              "internalType": "uint32",
              "name": "experienceBonus",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "dimensions",
              "type": "uint32"
            }
          ],
          "internalType": "struct ItemType",
          "name": "itemType_",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "getNumericTraits",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "numericTraits_",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "getWearableSet",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256[16]",
              "name": "wearableIds",
              "type": "uint256[16]"
            },
            {
              "internalType": "int256[5]",
              "name": "traitsBonuses",
              "type": "int256[5]"
            }
          ],
          "internalType": "struct IAavegotchiDiamond.WearableSetIO",
          "name": "wearableSet_",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ghstAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "contract_",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_tokenIds",
          "type": "uint256[]"
        },
        {
          "internalType": "uint32[]",
          "name": "_xpValues",
          "type": "uint32[]"
        }
      ],
      "name": "grantExperience",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_stakeAmount",
          "type": "uint256"
        }
      ],
      "name": "increaseStake",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "interact",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "approved_",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_account",
          "type": "address"
        }
      ],
      "name": "itemBalances",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "bals_",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_tokenContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "itemBalancesOfToken",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "bals_",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "kinship",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "score_",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "linkBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "linkBalance_",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_lockDuration",
          "type": "uint256"
        }
      ],
      "name": "lockAavegotchi",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "_itemIds",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_quantities",
          "type": "uint256[]"
        }
      ],
      "name": "mintItems",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "modifiedRarityScore",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "rarityScore_",
              "type": "uint256"
            },
            {
              "internalType": "int256[]",
              "name": "numericTraits_",
              "type": "int256[]"
            }
          ],
          "internalType": "struct IAavegotchiDiamond.ModifiedRarityScore",
          "name": "info_",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "_ids",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_values",
          "type": "uint256[]"
        },
        {
          "internalType": "bytes",
          "name": "_data",
          "type": "bytes"
        }
      ],
      "name": "onERC1155BatchReceived",
      "outputs": [
        {
          "internalType": "bytes4",
          "name": "",
          "type": "bytes4"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_tokenIds",
          "type": "uint256[]"
        }
      ],
      "name": "openPortals",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "owner_",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "portalAavegotchisSvg",
      "outputs": [
        {
          "internalType": "string[10]",
          "name": "svg_",
          "type": "string[10]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "_itemIds",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_quantities",
          "type": "uint256[]"
        }
      ],
      "name": "purchaseItemsWithGhst",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "_voucherIds",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_quantities",
          "type": "uint256[]"
        }
      ],
      "name": "purchaseItemsWithVouchers",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_numericTraits",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_collateralType",
          "type": "address"
        }
      ],
      "name": "rarityMultiplier",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "multiplier",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_requestId",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "_randomNumber",
          "type": "uint256"
        }
      ],
      "name": "rawFulfillRandomness",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "removeLinkTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "revenueShares",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "burnAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "daoAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "rarityFarming",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "pixelCraft",
              "type": "address"
            }
          ],
          "internalType": "struct IAavegotchiDiamond.RevenueSharesIO",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "_ids",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_values",
          "type": "uint256[]"
        },
        {
          "internalType": "bytes",
          "name": "_data",
          "type": "bytes"
        }
      ],
      "name": "safeBatchTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "setAavegotchiName",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "_approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_tokenIds",
          "type": "uint256[]"
        }
      ],
      "name": "setBatchId",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newDao",
          "type": "address"
        }
      ],
      "name": "setDao",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_gameManager",
          "type": "address"
        }
      ],
      "name": "setGameManager",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "internalType": "int8[4]",
          "name": "_values",
          "type": "int8[4]"
        }
      ],
      "name": "spendSkillPoints",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "totalSupply_",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalWearableSets",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_fromContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_fromTokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_toContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_toTokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transferAsChild",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_fromContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_fromTokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transferFromParent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_toContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_toTokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transferToParent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_collateralType",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_modifiers",
          "type": "uint256"
        }
      ],
      "name": "updateCollateralModifiers",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "_itemIds",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_quantities",
          "type": "uint256[]"
        }
      ],
      "name": "useConsumables",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "vrfInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "nextBatchId_",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "nextVrfCallTime_",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "vrfPending_",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "batchCount_",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]