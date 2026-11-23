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
  accentColor = '#3b82f6',
  buttonText = 'Update Cart'
}: {
  productName?: string;
  productImage?: string;
  productDescription?: string;
  accentColor?: string;
  buttonText?: string;
}) {
  const [selectedStrength, setSelectedStrength] = useState<string>('Enclomiphene 12.5mg + Tadalafil 2.5mg');
  const [selectedQuantity, setSelectedQuantity] = useState<string>('30 Day Supply');
  const [currentPrice, setCurrentPrice] = useState<number>(99);
  const [currentSaveOff, setCurrentSaveOff] = useState<number | null>(null);
  const [cartItemId, setCartItemId] = useState<string | null>(null);

  const strengths = variants.doseByStrengthViewModel.map(item => item.Strength);
  const quantities = variants.doseBySubscriptionDurationViewModel.map(item => item.SubscriptionDurationName);

  const updatePrice = (strength: string, quantity: string) => {
    const quantityData = variants.doseBySubscriptionDurationViewModel.find(
      item => item.SubscriptionDurationName === quantity
    );
    if (quantityData) {
      const dosage = quantityData.DosageDetail.find(d => d.Strength === strength);
      if (dosage) {
        setCurrentPrice(dosage.Price);
        setCurrentSaveOff(dosage.PriceSaveOff);
      }
    }
  };

  const handleStrengthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStrength = e.target.value;
    setSelectedStrength(newStrength);
    updatePrice(newStrength, selectedQuantity);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = e.target.value;
    setSelectedQuantity(newQuantity);
    updatePrice(selectedStrength, newQuantity);
  };

  const handleUpdateCart = () => {
    const cartApi = window.pathwai?.cart;
    if (!cartApi) {
      console.warn('Cart API not available');
      return;
    }

    const quantityData = variants.doseBySubscriptionDurationViewModel.find(
      item => item.SubscriptionDurationName === selectedQuantity
    );
    const dosage = quantityData?.DosageDetail.find(d => d.Strength === selectedStrength);

    if (dosage) {
      const productId = `product-${dosage.Id}`;
      const variants_array = [
        { name: 'Strength', value: selectedStrength },
        { name: 'Supply Duration', value: selectedQuantity }
      ];

      // If we have a previous cart item ID, remove it first
      if (cartItemId) {
        cartApi.removeItem(cartItemId, variants_array);
      }

      // Add the new item
      cartApi.addItem({
        id: productId,
        name: `${productName} - ${selectedStrength}`,
        price: dosage.Price,
        quantity: 1,
        image: productImage,
        variants: variants_array
      });

      // Store the new cart item ID for future updates
      setCartItemId(productId);
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {/* Product Image */}
  
        <img
          src={productImage}
          alt={productName}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            minHeight: '300px',
            objectFit: 'cover'
          }}
        />

      {/* Product Details */}
      <div style={{ marginBottom: '24px' }}>
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
          margin: '0 0 16px 0',
          lineHeight: '1.5'
        }}>
          {productDescription}
        </p>
      </div>

      {/* Strength Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '8px'
        }}>
          Select Strength
        </label>
        <select
          value={selectedStrength}
          onChange={handleStrengthChange}
          style={{
            width: '100%',
            padding: '10px 12px',
            fontSize: '14px',
            border: `2px solid ${accentColor}`,
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            color: '#1f2937',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          {strengths.map(strength => (
            <option key={strength} value={strength}>
              {strength}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity/Duration Selector */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '8px'
        }}>
          Select Supply Duration
        </label>
        <select
          value={selectedQuantity}
          onChange={handleQuantityChange}
          style={{
            width: '100%',
            padding: '10px 12px',
            fontSize: '14px',
            border: `2px solid ${accentColor}`,
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            color: '#1f2937',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          {quantities.map(quantity => (
            <option key={quantity} value={quantity}>
              {quantity}
            </option>
          ))}
        </select>
      </div>

      {/* Price Display */}
      <div style={{
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '6px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: '0 0 4px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Price
          </p>
          <p style={{
            fontSize: '28px',
            fontWeight: '700',
            color: accentColor,
            margin: '0'
          }}>
            ${currentPrice.toFixed(2)}
          </p>
        </div>
        {currentSaveOff && (
          <div style={{
            textAlign: 'right'
          }}>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: '0 0 4px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Regular Price
            </p>
            <p style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#9ca3af',
              margin: '0',
              textDecoration: 'line-through'
            }}>
              ${currentSaveOff.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* Update Cart Button */}
      <button
        onClick={handleUpdateCart}
        style={{
          width: '100%',
          padding: '14px 24px',
          fontSize: '16px',
          fontWeight: '600',
          color: '#ffffff',
          backgroundColor: accentColor,
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: `0 2px 4px rgba(0,0,0,0.1)`
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.9';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }}
      >
        {buttonText}
      </button>
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
  },
  buttonText: {
    type: 'string',
    title: 'Button Text',
    defaultValue: 'Update Cart'
  }
};