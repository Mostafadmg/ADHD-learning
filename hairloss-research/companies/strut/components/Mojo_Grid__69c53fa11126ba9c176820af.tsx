import React, { useState, useEffect } from 'react';

const variants = {
  "doseBySubscriptionDurationViewModel": [
    {
      "SubscriptionDurationName": "30 Day Supply",
      "SaveOff": null,
      "IsMostCommon": null,
      "SortSubscriptionDurationInDosageOption": null,
      "Price": 79,
      "DosageDetail": [
        {
          "Strength": "Enclomiphene 6.25mg + Tadalafil 2.5mg ~",
          "Price": 79,
          "PriceDisplay": "$79",
          "PriceSaveOff": null,
          "PriceSaveOffDisplay": null,
          "Note": null,
          "GroupHeaderInSelectDosageOption": null,
          "SortSubscriptionDurationInDosageOption": null,
          "Id": 887
        },
        {
          "Strength": "Enclomiphene 12.5mg + Tadalafil 2.5mg",
          "Price": 99,
          "PriceDisplay": "$99",
          "PriceSaveOff": null,
          "PriceSaveOffDisplay": null,
          "Note": null,
          "GroupHeaderInSelectDosageOption": null,
          "SortSubscriptionDurationInDosageOption": null,
          "Id": 890
        },
        {
          "Strength": "Enclomiphene 25mg + Tadalafil 5mg",
          "Price": 119,
          "PriceDisplay": "$119",
          "PriceSaveOff": null,
          "PriceSaveOffDisplay": null,
          "Note": null,
          "GroupHeaderInSelectDosageOption": null,
          "SortSubscriptionDurationInDosageOption": null,
          "Id": 892
        },
        {
          "Strength": "Enclomiphene 6.25mg",
          "Price": 79,
          "PriceDisplay": "$79",
          "PriceSaveOff": null,
          "PriceSaveOffDisplay": null,
          "Note": null,
          "GroupHeaderInSelectDosageOption": null,
          "SortSubscriptionDurationInDosageOption": null,
          "Id": 894
        },
        {
          "Strength": "Enclomiphene 12.5mg",
          "Price": 99,
          "PriceDisplay": "$99",
          "PriceSaveOff": null,
          "PriceSaveOffDisplay": null,
          "Note": null,
          "GroupHeaderInSelectDosageOption": null,
          "SortSubscriptionDurationInDosageOption": null,
          "Id": 896
        },
        {
          "Strength": "Enclomiphene 25mg",
          "Price": 119,
          "PriceDisplay": "$119",
          "PriceSaveOff": null,
          "PriceSaveOffDisplay": null,
          "Note": null,
          "GroupHeaderInSelectDosageOption": null,
          "SortSubscriptionDurationInDosageOption": null,
          "Id": 898
        }
      ],
      "Id": 6
    },
    {
      "SubscriptionDurationName": "90 Day Supply",
      "SaveOff": null,
      "IsMostCommon": null,
      "SortSubscriptionDurationInDosageOption": null,
      "Price": 189,
      "DosageDetail": [
        {
          "Strength": "Enclomiphene 6.25mg + Tadalafil 2.5mg ~",
          "Price": 189,
          "PriceDisplay": "$189",
          "PriceSaveOff": 237,
          "PriceSaveOffDisplay": "$237",
          "Note": "",
          "GroupHeaderInSelectDosageOption": null,
          "SortSubscriptionDurationInDosageOption": null,
          "Id": 889
        },
        {
          "Strength": "Enclomiphene 12.5mg + Tadalafil 2.5mg",
          "Price": 237,
          "PriceDisplay": "$237",
          "PriceSaveOff": 297,
          "PriceSaveOffDisplay": "$297",
          "Note": "",
          "GroupHeaderInSelectDosageOption": null,
          "SortSubscriptionDurationInDosageOption": null,
          "Id": 891
        },
        {
          "Strength": "Enclomiphene 25mg + Tadalafil 5mg",
          "Price": 285,
          "PriceDisplay": "$285",
          "PriceSaveOff": 357,
          "PriceSaveOffDisplay": "$357",
          "Note": "",
          "GroupHeaderInSelectDosageOption": null,
          "SortSubscriptionDurationInDosageOption": null,
          "Id": 893
        },
        {
          "Strength": "Enclomiphene 6.25mg",
          "Price": 189,
          "PriceDisplay": "$189",
          "PriceSaveOff": 237,
          "PriceSaveOffDisplay": "$237",
          "Note": "",
          "GroupHeaderInSelectDosageOption": null,
          "SortSubscriptionDurationInDosageOption": null,
          "Id": 895
        },
        {
          "Strength": "Enclomiphene 12.5mg",
          "Price": 237,
          "PriceDisplay": "$237",
          "PriceSaveOff": 297,
          "PriceSaveOffDisplay": "$297",
          "Note": "",
          "GroupHeaderInSelectDosageOption": null,
          "SortSubscriptionDurationInDosageOption": null,
          "Id": 897
        },
        {
          "Strength": "Enclomiphene 25mg",
          "Price": 285,
          "PriceDisplay": "$285",
          "PriceSaveOff": 357,
          "PriceSaveOffDisplay": "$357",
          "Note": "",
          "GroupHeaderInSelectDosageOption": null,
          "SortSubscriptionDurationInDosageOption": null,
          "Id": 899
        }
      ],
      "Id": 8
    }
  ],
  "doseByStrengthViewModel": [
    {
      "Strength": "Enclomiphene 6.25mg + Tadalafil 2.5mg ~",
      "IsMostCommon": null,
      "GroupHeaderInSelectDosageOption": null,
      "DosageDetail": [
        {
          "Id": 887,
          "SubscriptionDurationId": 6,
          "SubscriptionDurationName": "30 Day Supply",
          "Price": 79,
          "PriceDisplay": "$79",
          "PriceSaveOff": null,
          "PriceSaveOffDisplay": null,
          "Note": null,
          "SortSubscriptionDurationInDosageOption": null
        },
        {
          "Id": 889,
          "SubscriptionDurationId": 8,
          "SubscriptionDurationName": "90 Day Supply",
          "Price": 189,
          "PriceDisplay": "$189",
          "PriceSaveOff": 237,
          "PriceSaveOffDisplay": "$237",
          "Note": "",
          "SortSubscriptionDurationInDosageOption": null
        }
      ]
    },
    {
      "Strength": "Enclomiphene 12.5mg + Tadalafil 2.5mg",
      "IsMostCommon": true,
      "GroupHeaderInSelectDosageOption": null,
      "DosageDetail": [
        {
          "Id": 890,
          "SubscriptionDurationId": 6,
          "SubscriptionDurationName": "30 Day Supply",
          "Price": 99,
          "PriceDisplay": "$99",
          "PriceSaveOff": null,
          "PriceSaveOffDisplay": null,
          "Note": null,
          "SortSubscriptionDurationInDosageOption": null
        },
        {
          "Id": 891,
          "SubscriptionDurationId": 8,
          "SubscriptionDurationName": "90 Day Supply",
          "Price": 237,
          "PriceDisplay": "$237",
          "PriceSaveOff": 297,
          "PriceSaveOffDisplay": "$297",
          "Note": "",
          "SortSubscriptionDurationInDosageOption": null
        }
      ]
    },
    {
      "Strength": "Enclomiphene 25mg + Tadalafil 5mg",
      "IsMostCommon": null,
      "GroupHeaderInSelectDosageOption": null,
      "DosageDetail": [
        {
          "Id": 892,
          "SubscriptionDurationId": 6,
          "SubscriptionDurationName": "30 Day Supply",
          "Price": 119,
          "PriceDisplay": "$119",
          "PriceSaveOff": null,
          "PriceSaveOffDisplay": null,
          "Note": null,
          "SortSubscriptionDurationInDosageOption": null
        },
        {
          "Id": 893,
          "SubscriptionDurationId": 8,
          "SubscriptionDurationName": "90 Day Supply",
          "Price": 285,
          "PriceDisplay": "$285",
          "PriceSaveOff": 357,
          "PriceSaveOffDisplay": "$357",
          "Note": "",
          "SortSubscriptionDurationInDosageOption": null
        }
      ]
    },
    {
      "Strength": "Enclomiphene 6.25mg",
      "IsMostCommon": null,
      "GroupHeaderInSelectDosageOption": null,
      "DosageDetail": [
        {
          "Id": 894,
          "SubscriptionDurationId": 6,
          "SubscriptionDurationName": "30 Day Supply",
          "Price": 79,
          "PriceDisplay": "$79",
          "PriceSaveOff": null,
          "PriceSaveOffDisplay": null,
          "Note": null,
          "SortSubscriptionDurationInDosageOption": null
        },
        {
          "Id": 895,
          "SubscriptionDurationId": 8,
          "SubscriptionDurationName": "90 Day Supply",
          "Price": 189,
          "PriceDisplay": "$189",
          "PriceSaveOff": 237,
          "PriceSaveOffDisplay": "$237",
          "Note": "",
          "SortSubscriptionDurationInDosageOption": null
        }
      ]
    },
    {
      "Strength": "Enclomiphene 12.5mg",
      "IsMostCommon": null,
      "GroupHeaderInSelectDosageOption": null,
      "DosageDetail": [
        {
          "Id": 896,
          "SubscriptionDurationId": 6,
          "SubscriptionDurationName": "30 Day Supply",
          "Price": 99,
          "PriceDisplay": "$99",
          "PriceSaveOff": null,
          "PriceSaveOffDisplay": null,
          "Note": null,
          "SortSubscriptionDurationInDosageOption": null
        },
        {
          "Id": 897,
          "SubscriptionDurationId": 8,
          "SubscriptionDurationName": "90 Day Supply",
          "Price": 237,
          "PriceDisplay": "$237",
          "PriceSaveOff": 297,
          "PriceSaveOffDisplay": "$297",
          "Note": "",
          "SortSubscriptionDurationInDosageOption": null
        }
      ]
    },
    {
      "Strength": "Enclomiphene 25mg",
      "IsMostCommon": null,
      "GroupHeaderInSelectDosageOption": null,
      "DosageDetail": [
        {
          "Id": 898,
          "SubscriptionDurationId": 6,
          "SubscriptionDurationName": "30 Day Supply",
          "Price": 119,
          "PriceDisplay": "$119",
          "PriceSaveOff": null,
          "PriceSaveOffDisplay": null,
          "Note": null,
          "SortSubscriptionDurationInDosageOption": null
        },
        {
          "Id": 899,
          "SubscriptionDurationId": 8,
          "SubscriptionDurationName": "90 Day Supply",
          "Price": 285,
          "PriceDisplay": "$285",
          "PriceSaveOff": 357,
          "PriceSaveOffDisplay": "$357",
          "Note": "",
          "SortSubscriptionDurationInDosageOption": null
        }
      ]
    }
  ]
};

export default function ProductSelector({
  productName = 'Premium Enclomiphene + Tadalafil',
  productImage = 'https://via.placeholder.com/400x300?text=Product+Image',
  productDescription = 'High-quality pharmaceutical formulation',
  accentColor = '#3b82f6'
}: {
  productName?: string;
  productImage?: string;
  productDescription?: string;
  accentColor?: string;
}) {
  const [selectedItemId, setSelectedItemId] = useState<number | null>(890);
  const [cartItemId, setCartItemId] = useState<string | null>(null);

  const handleSelectVariant = (dosageId: number, strength: string, duration: string, price: number) => {
    const cartApi = window.pathwai?.cart;
    if (!cartApi) {
      console.warn('Cart API not available');
      return;
    }

    const productId = `product-${dosageId}`;
    const variants_array = [
      { name: 'Strength', value: strength },
      { name: 'Supply Duration', value: duration }
    ];

    // If we have a previous cart item ID, remove it first
    if (cartItemId) {
      cartApi.removeItem(cartItemId);
    }

    // Add the new item
    cartApi.addItem({
      id: productId,
      name: `${productName} - ${strength}`,
      price: price,
      quantity: 1,
      image: productImage,
      variants: variants_array
    });

    // Store the new cart item ID and selected item
    setCartItemId(productId);
    setSelectedItemId(dosageId);
  };

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '12px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: 'transparent'
    }}>
      {/* Product Image */}
      <img
        src={productImage}
        alt={productName}
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '400px',
          display: 'block',
          objectFit: 'cover',
          borderRadius: '8px',
          marginBottom: '16px'
        }}
      />

      {/* Product Details */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          margin: '0 0 8px 0',
          color: '#1f2937'
        }}>
          {productName}
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          margin: '0',
          lineHeight: '1.5'
        }}>
          {productDescription}
        </p>
      </div>

      {/* Variants Table */}
      <div style={{
        overflowX: 'auto',
        marginBottom: '16px'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#f3f4f6',
              borderBottom: `2px solid ${accentColor}`
            }}>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                Strength
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'center',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                30 Day Supply
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'center',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                90 Day Supply
              </th>
            </tr>
          </thead>
          <tbody>
            {variants.doseByStrengthViewModel.map((strengthItem) => {
              const thirtyDayDosage = strengthItem.DosageDetail.find(
                d => d.SubscriptionDurationName === '30 Day Supply'
              );
              const ninetyDayDosage = strengthItem.DosageDetail.find(
                d => d.SubscriptionDurationName === '90 Day Supply'
              );

              return (
                <tr key={strengthItem.Strength} style={{
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <td style={{
                    padding: '16px',
                    color: '#1f2937',
                    fontWeight: '500'
                  }}>
                    {strengthItem.Strength}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    textAlign: 'center'
                  }}>
                    {thirtyDayDosage && (
                      <button
                        onClick={() => handleSelectVariant(
                          thirtyDayDosage.Id,
                          strengthItem.Strength,
                          '30 Day Supply',
                          thirtyDayDosage.Price
                        )}
                        style={{
                          padding: '10px 16px',
                          backgroundColor: selectedItemId === thirtyDayDosage.Id ? accentColor : '#f3f4f6',
                          color: selectedItemId === thirtyDayDosage.Id ? '#ffffff' : '#1f2937',
                          border: `2px solid ${selectedItemId === thirtyDayDosage.Id ? accentColor : '#d1d5db'}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedItemId !== thirtyDayDosage.Id) {
                            e.currentTarget.style.backgroundColor = '#e5e7eb';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedItemId !== thirtyDayDosage.Id) {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                          }
                        }}
                      >
                        ${thirtyDayDosage.Price.toFixed(2)}
                      </button>
                    )}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    textAlign: 'center'
                  }}>
                    {ninetyDayDosage && (
                      <div>
                        <button
                          onClick={() => handleSelectVariant(
                            ninetyDayDosage.Id,
                            strengthItem.Strength,
                            '90 Day Supply',
                            ninetyDayDosage.Price
                          )}
                          style={{
                            padding: '10px 16px',
                            backgroundColor: selectedItemId === ninetyDayDosage.Id ? accentColor : '#f3f4f6',
                            color: selectedItemId === ninetyDayDosage.Id ? '#ffffff' : '#1f2937',
                            border: `2px solid ${selectedItemId === ninetyDayDosage.Id ? accentColor : '#d1d5db'}`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap',
                            display: 'block',
                            marginBottom: '4px'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedItemId !== ninetyDayDosage.Id) {
                              e.currentTarget.style.backgroundColor = '#e5e7eb';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedItemId !== ninetyDayDosage.Id) {
                              e.currentTarget.style.backgroundColor = '#f3f4f6';
                            }
                          }}
                        >
                          ${ninetyDayDosage.Price.toFixed(2)}
                        </button>
                        {ninetyDayDosage.PriceSaveOff && (
                          <p style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            margin: '4px 0 0 0',
                            textDecoration: 'line-through'
                          }}>
                            ${ninetyDayDosage.PriceSaveOff.toFixed(2)}
                          </p>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info text */}
      <p style={{
        fontSize: '12px',
        color: '#6b7280',
        margin: '0',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        Click on any price to select and add to cart
      </p>
    </div>
  );
}

export const propSchema = {
  productName: {
    type: 'string',
    title: 'Product Name',
    defaultValue: 'Premium Enclomiphene + Tadalafil'
  },
  productImage: {
    type: 'image',
    title: 'Product Image',
    defaultValue: 'https://cdn.prod.website-files.com/60aac6f6dd71db0cdb8002fc/69aac50bf7d537dd84b372b5_Strut%20Mojo%20(Enclomiphene%20%2B%20Tadalafil)-p-1080.png'
  },
  productDescription: {
    type: 'string',
    title: 'Product Description',
    defaultValue: 'High-quality pharmaceutical formulation'
  },
  accentColor: {
    type: 'color',
    title: 'Accent Color',
    defaultValue: '#3b82f6'
  }
};
