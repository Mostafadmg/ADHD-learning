// SOURCE: inline <script> on https://sons.co.uk/pages/recommendation (fetched anonymously 2026-11-23), lines 690-1965 of src/recommendation-page.inline.js.
// This is the code that turns consultation answers (consult_results) into the list of plans shown. Not edited.

                <p style="margin-top: 1rem;"><b>${market === 'de' ? 'Einmalkauf:' : 'One-time purchase:'}</b></p>
                <ul>
                  <li>${market === 'de' ? '100% flexibel – bestelle die Produkte gegen Haarausfall, wann du willst.' : 'No subscription required'}</li>
                  <li>${market === 'de' ? 'Ideal, um uns erst einmal auszuprobieren.' : '+€14.99 treatment fee'}</li>
                  <li>${market === 'de' ? 'Bitte beachte, dass Finasterid und Minoxidil Zeit und eine regelmäßige Einnahme bzw. Anwendung benötigen. Die Produkte zeigen ihre Wirkung nach etwa 6 Monaten.' : '+€14.99 treatment fee'}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="subscription-type-selector" style="margin-bottom: 2rem; display: flex; gap: 1rem;">
            <button class="type-btn active" data-type="subscription" style="flex: 1; padding: 1rem; border: 2px solid #ddd; background: #bbbbbb; cursor: pointer; border-radius: 20px; font-weight: bold; transition: all 0.2s; color: #000;">
              ${market === 'de' ? 'Im Abo' : 'Subscribe & Save'}
              ${!(market === 'de' && rec.product.handle === 'minoxidil') ? `<p style="font-size: 12px; margin: 8px 0 0 0;">0 € ${market === 'de' ? 'Behandlungsgebühr' : 'Treatment Fee'}</p>` : ''}
            </button>
            <button class="type-btn" data-type="one-time" style="flex: 1; padding: 1rem; border: 2px solid #ddd; background: #e9e9ea; cursor: pointer; border-radius: 20px; font-weight: bold; transition: all 0.2s; color: #000;">
              ${market === 'de' ? 'Einmalige Bestellung' : 'One-Time Purchase'}
              ${!(market === 'de' && rec.product.handle === 'minoxidil') ? `<p style="font-size: 12px; margin: 8px 0 0 0;">+14,99 € ${market === 'de' ? 'Behandlungsgebühr' : 'Treatment Fee'}</p>` : ''}
            </button>
          </div>
        ` : ''}
        <div class="sons-subscription-info select-subscription">
          <p class="choose-your-plan">${market  === 'de' ? 'Wähle deinen Plan' : 'Choose your plan'}</p>
          <ul data-subscription-type="subscription" class="variant-list product-form list-view uk_item_list">${renderVariantsForProduct(rec.product, 'subscription')}</ul>
          ${haveOneTimeRecPrimary ? `<ul data-subscription-type="one-time" class="variant-list product-form list-view uk_item_list" style="display: none;">${renderVariantsForProduct(rec.product, 'one-time')}</ul>` : ''}
        </div>
      </div>
    </div>`;
}

// Main DOMContentLoaded logic
document.addEventListener("DOMContentLoaded", function () {
  let customerData = null;

  // Include `customer.tags` if available
  // if (customerData) {
  //   if (typeof null !== "undefined") {
  //     customerData = {
  //       ...(customerData || {}), // Ensure we keep existing data
  //       tags: null // Add `tags` from the Shopify `customer` object
  //     };
  //   }
  // }
  
  // Fallback to Shopify Metafields (if available)
  if (!customerData) {
    customerData = null;
  }
  
  // Fallback to localStorage
  if (!customerData) {
    customerData = JSON.parse(localStorage.getItem("cf_customer_data"));
  }
  
  // Handle case where no customer data is found
  let consultUrl = 'https://shop.sons.co.uk/consultation/';
  const currentMarket = 'uk';
  if (currentMarket === 'uk') {
    consultUrl = 'https://shop.sons.co.uk'+'/consultation?logged_in=false';
  }
  if (currentMarket === 'ie') {
    consultUrl = 'https://shop.sons.co.uk'+'/ie/consultation?logged_in=false';
  }
  if (currentMarket === 'de') {
    consultUrl = 'https://shop.sons.co.uk'+'/de/consultation?logged_in=false';
  }
  const consultationResults = JSON.parse(sessionStorage.getItem('consultationResults') || '{}');
  if (consultationResults?.message === "UNABLE_TO_FIND_CONSULTATION") {
    // If no consutlation available Show a message inviting the user to take a consultation
    const recommendationContainer = document.getElementById("recommendation-main");
    if (recommendationContainer) {
      recommendationContainer.innerHTML = `
            <h2>Personalized Recommendations</h2>
            <p>We couldn't find consultations in your profile. To get personalized hair loss recommendations. Please <a href="${consultUrl}">complete our consultation</a> to get personalized recommendations.</p>
          `;
      // Track how many users hit this dead-end (no consultation found → retake consult)
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'unable_to_find_consultation',
        market: 'uk',
        reason: 'unable_to_find_consultation',
        logged_in: false
      });
      return;
    }
  }
  if (!customerData) {
    console.warn("No customer data available.");

    // If a valid token is being processed, show loading state instead of error
    if (window.hasValidToken) {
      console.log("Valid token detected, autologin in progress...");
      const recommendationContainer = document.getElementById("recommendation-main");
      if (recommendationContainer) {
        recommendationContainer.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center;">
            <div class="sons-symbol sons-symbol sons_logo reveal is-active" style="width: 50px; margin-bottom: 20px;">
              <div class="sons_logo_container">
                <div class="sons-symbol__part top-left" style="background-color: #24272a;"></div>
                <div class="sons-symbol__part top-right" style="background-color: #24272a;"></div>
                <div class="sons-symbol__part bottom-left" style="background-color: #24272a;"></div>
                <div class="sons-symbol__part bottom-right" style="background-color: #24272a;"></div>
              </div>
            </div>
            <p>Logging you in...</p>
          </div>
        `;
      }
      return;
    }

    // Show a message inviting the user to take a consultation
    const recommendationContainer = document.getElementById("recommendation-main");
    if (recommendationContainer) {
      if (currentMarket === 'de') {
           recommendationContainer.innerHTML = `
          <h2>Keine Empfehlungen verfügbar</h2>
          <p>Es scheint, dass wir dein Kundenprofil nicht finden konnten. Bitte <a href="${consultUrl}">nimm an unserer Beratung</a> teil, um personalisierte Empfehlungen zu erhalten.</p>
      `;
      }else{
        recommendationContainer.innerHTML = `
          <h2>No Recommendations Available</h2>
          <p>It looks like we couldn't find your customer profile. Please <a href="/account/login?return_url=%2Fpages%2Frecommendation">login</a> or <a href="${consultUrl}">take our consultation</a> to get personalized recommendations.</p>
        `;
      }
      // Track how many users hit this dead-end (no profile found → retake consult)
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'no_recommendations_available',
        market: currentMarket,
        logged_in: false
      });
    }
    return;
  }
    
  // Base64 encode the shopifyCustomerId
  let shopifyCustomerId = null;
  
  try {
    shopifyCustomerId = null;
  } catch (error) {
    console.warn("Failed to retrieve Shopify customer ID from backend, falling back to localStorage.");
  }
  
  // If backend `customer.id` is unavailable, fallback to localStorage or set as "guest"
  shopifyCustomerId = shopifyCustomerId || localStorage.getItem("cf_shopify_customer_id") || "guest";
  
  const dataToken = btoa(shopifyCustomerId);

  if (!customerData) {
    console.warn("Customer data not found in LocalStorage.");
    return;
  }

  if (!customerData) {
  console.warn("Customer data not found in LocalStorage.");
  return;
}

// Check if no customer ID is found
if (!shopifyCustomerId || shopifyCustomerId === "guest") {
  // If no customer ID, show consultation invitation
  const recommendationContainer = document.getElementById("recommendation-main");
  if (recommendationContainer) {
    recommendationContainer.innerHTML = `
      <h2>Personalized Recommendations</h2>
      <p>We couldn't find your profile. To get personalized hair loss recommendations, please complete our consultation.</p>
      <a href="/consultation" class="button blue">Take the Consultation</a>
    `;
    // Track how many users hit this dead-end (no customer id → retake consult)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'no_recommendations_available',
      market: 'uk',
      reason: 'no_customer_id',
      logged_in: false
    });
  }
} else {

 var base_url = "https://api.sons.co.uk";
    var url = base_url + '/account/login';

    $.ajax({
      url: url,
      type: 'POST',
      crossDomain: true,
      contentType: 'application/json',
      data: JSON.stringify({
        "token": ""
      }),
      xhrFields: {
        withCredentials: true
      },
      success: function(response) {
        console.log("Login API Response: ", response);

        var url = base_url + '/cart/data';

        $.ajax({
          url: url,
          type: 'GET',
          crossDomain: true,
          xhrFields: {
            withCredentials: true
          },
          success: function(cartResponse) {
            
            console.log("Cart Data API Response: ", cartResponse);

            // Extracting and transforming existing_medications
            if (cartResponse && cartResponse.existing_medications) {
              let transformedMedications = cartResponse.existing_medications.map(medication =>
                medication.toLowerCase().replace(/\s+/g, '-')
              );

              // Same ingredient normalization as the PDP's extractNames: these
              // purchased-item names carry no ingredient keyword, so expand
              // them for the medication conflict check.
              transformedMedications = transformedMedications.map(m => m === 'combination-capsule' ? 'minoxidil' : m);
              if (transformedMedications.includes('ultimate-plan') && !transformedMedications.includes('finasteride')) {
                transformedMedications.push('finasteride', 'hair-growth-complex', 'minoxidil', 'shampoo');
              } else if (transformedMedications.includes('core-plan') && !transformedMedications.includes('finasteride')) {
                transformedMedications.push('finasteride', 'minoxidil');
              }

              sessionStorage.setItem('existingMedications', JSON.stringify(transformedMedications));
              console.log("Transformed Existing Medications saved to sessionStorage:", transformedMedications);
            } else {
              console.warn("No existing medications found in the response.");
            }

            if (cartResponse && cartResponse.consultation_results) {
              sessionStorage.setItem('consultationResults', JSON.stringify(cartResponse.consultation_results));
              console.log("consultationResults:", cartResponse.consultation_results);
            } else {
              console.warn("No consultationResults found in the response.");
            }

            /** Store oral minoxidil eligibility before rendering recommendations.**/
            // New IE customers (no active subscription) are always eligible for oral minoxidil.
            var oralMinoxidilEligible = cartResponse.is_oral_minoxidil_eligible === true || cartResponse.is_oral_minoxidil_eligible === 'true';
            
            sessionStorage.setItem('is_oral_minoxidil_eligible', JSON.stringify(oralMinoxidilEligible));

            runRecommendationLogic();
          },
          error: function(xhr, status, error) {
            console.error("Error in Cart Data API: " + error);
            
          }
        });
      },
      error: function(xhr, status, error) {
        console.error("Error in Login API: " + error);
      }
    });

function runRecommendationLogic() {
if (!customerData) customerData = {};

// Extract required data
customerData = {
  ...customerData,                                  // keep whatever was there
  tags: Array.isArray(window.customerTags)          // always end up with an array
        ? window.customerTags
        : []
};

const {
  tags = [],
  date_of_birth,
  existing_conditions = [],
  used_fin_or_prop,
  finamino_sideeffects,
  hair_loss_level,
  non_p_suggested,
  blood_pressure_controlled,
  hair_allergies = [],
} = customerData;

// 1) Grab the consultation results from sessionStorage (or however you have them)
const consultationResults = JSON.parse(sessionStorage.getItem('consultationResults') || '{}');
const consultResults = consultationResults.consult_results || {};

// 2) Extract relevant answers
// ------------------------------------------------

// 2a) The array of numeric conditions from question 5155
// e.g. [0, 5, 7] meaning High BP, Scalp Disorder, Lactose Allergy
const existingConditions = consultResults["5155"] || [];

// 2b) Onset of hair loss (5143): 0 = Gradual, 1 = Sudden
const hairLossOnset = consultResults["5143"];

// 2c) Mood question (3216): 0 = No, 1 = Yes
const moodIssues = consultResults["3216"];

// 2d) PHQ questions: each can be 0..3
const littleInterest = consultResults["3275"]; // Over the past 2 weeks, little interest
const feelingDown   = consultResults["3276"]; // Over the past 2 weeks, depressed/hopeless

// 2e) Side-effect questions
//     "Have you experienced any adverse effects from Finasteride?" => 0=No, 1=Yes
const finasterideSideEffects = consultResults["5149"];
//     "Minoxidil side effects?"
const minoxidilSideEffects   = consultResults["5151"];
//     "Topical Combo side effects?"
const comboSideEffects       = consultResults["5153"];

const treatmentPreference    = consultResults["What treatment type do you prefer?"];

console.log("Data: ", customerData);

console.log("Tags: ", customerData.tags);

// Define recommendations and logic explanations
let allowedOralFinasteride = true;
let allowedTopicalFinasteride = true;
let allowedOralMinoxidil = true;
let allowedTopicalMinoxidil = true;
let allowedTopicalCombo = true;

console.log('consultResults', consultResults);

// 3. Set recommendations based on that preference
let recommendations = [];
let pairedProducts = [];
let additionalPairedProducts = [];
let answeredQuestion = false;
let currentMarket = "uk"

console.log('treatmentPreference', treatmentPreference);
if(currentMarket === 'uk'){
  if (treatmentPreference === 0) {
    // Topical sprays
    recommendations = [
      "the-duo-plan",
      "oral-duo-plan",
      "topical-finasteride-minoxidil-spray",
      "hair-loss-spray-hair-loss-capsule",
      "ultimate-hair-loss-plan",
      "ultimate-hair-loss-plan-capsule",
      "minoxidil",
      "oral-minoxidil",
      "topical-hair-loss-spray",
      "finasteride",
      "the-non-prescription-plan",
      "hair-growth-complex",
    ];

    pairedProducts = {
      "ultimate-hair-loss-plan": "ultimate-hair-loss-plan-capsule",
      "the-duo-plan": "oral-duo-plan",
      "topical-hair-loss-spray": "finasteride",
      "minoxidil": "oral-minoxidil",
    };
  } else {
    answeredQuestion = true;
    // Oral or "I don't mind"
    recommendations = [
      "oral-duo-plan",
      "the-duo-plan",
      "topical-finasteride-minoxidil-spray",
      "hair-loss-spray-hair-loss-capsule",
      "ultimate-hair-loss-plan-capsule",
      "ultimate-hair-loss-plan",
      "oral-minoxidil",
      "minoxidil",
      "finasteride",
      "topical-hair-loss-spray",
      "the-non-prescription-plan",
      "hair-growth-complex",
    ];

    pairedProducts = {
      "ultimate-hair-loss-plan-capsule": "ultimate-hair-loss-plan",
      "oral-duo-plan": "the-duo-plan",
      "finasteride": "topical-hair-loss-spray",
      "oral-minoxidil": "minoxidil",
    };
  }
}else if(currentMarket === 'ie'){
  recommendations = [
    "the-duo-plan",
    "finasteride",
    "topical-hair-loss-spray",
    "minoxidil",
    "ultimate-hair-loss-plan",
    "non-prescription-advanced",
    "ultimate-hair-loss-plan-capsule",
    "oral-duo-plan",
    "oral-minoxidil"
  ];
  const is_oral_minoxidil_eligible = sessionStorage.getItem('is_oral_minoxidil_eligible');
  if(is_oral_minoxidil_eligible === true || is_oral_minoxidil_eligible === 'true'){
      recommendations = [
      "the-duo-plan",
      "minoxidil",      
      "oral-duo-plan",
      "finasteride", 
      "oral-minoxidil", 
          
      "ultimate-hair-loss-plan",
      "ultimate-hair-loss-plan-capsule",
      "non-prescription-advanced"
    ];
    if(!tags.includes("minoxidil_disallowed") && !tags.includes("finasteride_disallowed")){
      pairedProducts = {
        "ultimate-hair-loss-plan-capsule":"ultimate-hair-loss-plan",
        "oral-duo-plan":"the-duo-plan",
      }
    }
    if(!tags.includes("minoxidil_disallowed")){
      const  minoxidilPairedProducts = {
        "oral-minoxidil":"minoxidil"
      }
      pairedProducts = {
        ...pairedProducts,
        ...minoxidilPairedProducts
      }
    }
  }
}else if(currentMarket === 'de'){
  recommendations = [
    "das-duo-programm",
    "der-duo-plan-tablette",
    "finasterid",
    "oral-minoxidil",
    "der-ultimative-plan",
    "der-ultimative-plan-tablette",
    "das-rezeptfreie-programm-hgc"
  ];
  pairedProducts = {
      "das-duo-programm": "der-duo-plan-tablette",
      "der-ultimative-plan": "der-ultimative-plan-tablette"
  };
}

// // Check for the tag
// if (tags.includes("topical_finasteride")) {
//   // Remove "finasteride", "topical-hair-loss-spray", and "hair-loss-spray-hair-loss-capsule" if they already exist in the array
//   recommendations = recommendations.filter(
//     (item) =>
//       item !== "finasteride" &&
//       item !== "topical-hair-loss-spray" &&
//       item !== "hair-loss-spray-hair-loss-capsule"
//   );

//   // Add entries in the desired order
//   recommendations.unshift("finasteride"); // Second position
//   recommendations.unshift("topical-hair-loss-spray"); // Top position
//   recommendations.unshift("hair-loss-spray-hair-loss-capsule"); // New topmost entry
// }

console.log("Customer tags:", tags);

const urlHasCombo = false;

const urlHasTopicalFina = false;

console.log("Combo: ", urlHasCombo);

if (tags.includes("dutasteride_eligible") && urlHasCombo) {
  // Ensure "dutasteride-combination-spray" is not duplicated
  recommendations = recommendations.filter(item => item !== "dutasteride-combination-spray");

  // Add "dutasteride-combination-spray" to the start of the array
  recommendations.unshift("dutasteride-combination-spray");

  console.log('"dutasteride-combination-spray" added to recommendations:', recommendations);
} else {
  console.log('"dutasteride_eligible" tag not found. No change to recommendations.');
}

if (tags.includes("combo_pill_eligible") && urlHasCombo) {
  // Ensure "combination-capsule" is not duplicated
  recommendations = recommendations.filter(item => item !== "combination-capsule");

  // Add "combination-capsule" to the start of the array
  recommendations.unshift("combination-capsule");

  console.log('"combination-capsule" added to recommendations:', recommendations);
} else {
  console.log('"combo_pill_eligible" tag not found. No change to recommendations.');
}


if ((false || false || false && tags.includes("ie_clinic_flow_customer")) || (tags.includes("topical_finasteride_eligible") && urlHasTopicalFina) && currentMarket === 'ie') {
  const is_oral_minoxidil_eligible =
    tags.includes("ie_clinic_flow_customer") ||
    sessionStorage.getItem('is_oral_minoxidil_eligible') === 'true';
  recommendations = [];
   recommendations.push("the-duo-plan");
   if(is_oral_minoxidil_eligible === true || is_oral_minoxidil_eligible === 'true'){
      recommendations.push("oral-duo-plan");
  }
  if(is_oral_minoxidil_eligible === true || is_oral_minoxidil_eligible === 'true'){     
     recommendations.push("hair-loss-spray-hair-loss-capsule");
  }
  if(is_oral_minoxidil_eligible === true || is_oral_minoxidil_eligible === 'true'){
     recommendations.push("oral-minoxidil");
  }
  recommendations.push("minoxidil");
  recommendations.push("topical-hair-loss-spray");
  recommendations.push("finasteride");
  recommendations.push("ultimate-hair-loss-plan");
  if(is_oral_minoxidil_eligible === true || is_oral_minoxidil_eligible === 'true'){     
     recommendations.push("ultimate-hair-loss-plan-capsule");
  }
  recommendations.push("non-prescription-advanced");
  if((is_oral_minoxidil_eligible === true || is_oral_minoxidil_eligible === 'true')){
    if(!tags.includes("minoxidil_disallowed") && !tags.includes("finasteride_disallowed")){
        pairedProducts = {
          "ultimate-hair-loss-plan-capsule":"ultimate-hair-loss-plan",
          "oral-duo-plan":"the-duo-plan",
        }
    }
    if(!tags.includes("minoxidil_disallowed")){
      const  minoxidilPairedProducts = {
        "oral-minoxidil":"minoxidil"
      }
      pairedProducts = {
        ...pairedProducts,
        ...minoxidilPairedProducts
      }
    }
    if(!tags.includes("finasteride_disallowed")){
      const  FinaPairedProducts = {
        "topical-hair-loss-spray" : "finasteride"
      }
      pairedProducts = {
        ...pairedProducts,
        ...FinaPairedProducts
      }
    }
  }else{
    if(!tags.includes("finasteride_disallowed")){
      pairedProducts = {
        "topical-hair-loss-spray" : "finasteride"
      }
    }
  }
 
  console.log('"topical-hair-loss-spray" added to recommendations:', recommendations);
} else {
  console.log('"topical_finasteride_eligible" tag not found. No change to recommendations.');
}
  
// Retrieve the stored recommendation
let storedRecommendation = sessionStorage.getItem("chosenProduct");

// Treat "the-duo-plan" as "oral-duo-plan"
if (storedRecommendation === "the-duo-plan") {
  storedRecommendation = "oral-duo-plan";
}
if (storedRecommendation === "oral-capsule") {
  storedRecommendation = "oral-minoxidil";
}
if (storedRecommendation === "oral-tablet") {
  storedRecommendation = "finasteride";
}

// Adjust the recommendations
if (storedRecommendation) {
  // Remove the stored recommendation if it already exists
  recommendations = recommendations.filter(item => item !== storedRecommendation);

  // Add it to the top
  recommendations.unshift(storedRecommendation);
}

let logicExplanations = {};

// 4) Mapping each 5155 value to a condition (for readability)
// -----------------------------------------------------------
const HIGH_BLOOD_PRESSURE  = 0;
const CARDIOVASCULAR       = 1;
const SEVERE_KIDNEY_LIVER  = 2;
const PROSTATE_OR_CANCER   = 3;
const RHEUMATOID_LUPUS_MTX = 4;
const SCALP_DISORDERS      = 5;
const PHAEOCHROMOCYTOMA    = 6;
const LACTOSE_ALLERGY      = 7;
const SEXUAL_DYSFUNCTION   = 8;

// Check if customer has "Hair loss" tag
// if (tags.includes("Hair loss")) {
  // Calculate if customer is over 65
  const currentDate = new Date();
  const birthDate = new Date(date_of_birth);
  const ageInMilliseconds = currentDate - birthDate;
  const ageInYears = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));
  const overSixtyFive = ageInYears > 65;

  console.log("Existing Conditions: " + existing_conditions);

  if (existing_conditions === 'undefined' || existing_conditions === null) {
        existing_conditions = [];
  }
  // Apply conditions with explanations
  if (
    existing_conditions.includes("High Blood Pressure") &&
    blood_pressure_controlled === "No"
  ) {
    allowedOralMinoxidil = false;
    allowedTopicalMinoxidil = false;
    allowedTopicalCombo = false;
    logicExplanations["High Blood Pressure"] =
      "Minoxidil is not recommended due to high blood pressure.";
  }

  if (existing_conditions.includes("Sexual Dysfunction")) {
    allowedOralFinasteride = false;
    allowedTopicalFinasteride = false;
    logicExplanations["Sexual Dysfunction"] =
      "Finasteride is not recommended due to potential side effects related to sexual dysfunction.";
  }
  
  if (hair_allergies.includes("Minoxidil/Propylene Glycol") ||
    finamino_sideeffects === "Yes - Minoxidil") {
    allowedOralMinoxidil = false;
    allowedTopicalMinoxidil = false;
    allowedTopicalCombo = false;
    logicExplanations["Allergy to Minoxidil/Propylene Glycol"] =
      "Minoxidil is not recommended due to reported side affects.";
  }
  
  // Check if any condition in the disallow list is present
  if (
    existing_conditions.includes("Rheumatoid Arthritis, Systemic Lupus or on Methotrexate") ||
    existing_conditions.includes("Rheumatoid Arthritis") ||
    existing_conditions.includes("Systemic Lupus") ||
    existing_conditions.includes("Kidney Disease") ||
    existing_conditions.includes("Severe Kidney Disease/Dialysis") ||
    existing_conditions.includes("Liver Disease") ||
    existing_conditions.includes("Liver Disease or Abnormal Liver Function") ||
    existing_conditions.includes("Prostate Disease") ||
    existing_conditions.includes("Prostate Disease, Male Breast Cancer or Testicular Cancer") ||
    existing_conditions.includes("Male Breast Cancer") ||
    existing_conditions.includes("Depression") ||
    existing_conditions.includes("Anxiety")
  ) {
    allowedOralFinasteride = false;
    allowedTopicalFinasteride = false;
    allowedTopicalCombo = false;
    logicExplanations["Disallowed Finasteride"] =
      "Finasteride is not recommended due to your existing medical conditions.";
  }

  // Check for significant mental health conditions
  if (
    existing_conditions.includes("Significant Depression or Anxiety") ||
    existing_conditions.includes("Other Mental Health Disorders")
  ) {
    // Restrict Finasteride (oral and topical) and the topical combo spray
    allowedOralFinasteride = false;
    allowedTopicalFinasteride = false;
    allowedTopicalCombo = false;
  
    // Explanation for this restriction
    logicExplanations["Mental Health Restrictions"] =
      "Due to reported mental health conditions, Finasteride is not recommended.";
  }

  // Check for Lactose Allergy or Intolerance
  if (
    existing_conditions.includes("Diagnosed Lactose Allergy") ||
    hair_allergies.includes("Lactose Intolerance/Allergy") ||
    hair_allergies.includes("Lactose")
  ) {
    // Restrict Oral Finasteride and Oral Minoxidil
    allowedOralFinasteride = false;
    allowedOralMinoxidil = false;
  
    // Add reasoning for this restriction
    logicExplanations["Lactose Allergy or Intolerance"] =
      "Oral Finasteride and Oral Minoxidil are not recommended due to a reported lactose allergy or intolerance.";
  }
  
  // Check for Finasteride-related side effects or allergies
  if (
    hair_allergies.includes("Finasteride") ||
    finamino_sideeffects === "Yes - Finasteride"
  ) {
    allowedOralFinasteride = false;
    allowedTopicalFinasteride = false;
    allowedTopicalCombo = false;
  
    // Combine explanations based on the reason(s)
    let reasons = [];
    if (hair_allergies.includes("Finasteride")) {
      reasons.push("reported allergies");
    }
    if (finamino_sideeffects === "Yes - Finasteride") {
      reasons.push("reported side effects");
    }
  
    logicExplanations["Finasteride Restrictions"] =
      `Finasteride is not recommended due to ${reasons.join(" and ")}.`;
  }
  
  // Psoriasis, Eczema, or Scalp Conditions Check
  if (
    existing_conditions.some(condition =>
      [
        "Psoriasis",
        "Eczema",
        "Psoriasis, Severe Eczema/Dermatitis or Scalp Infection",
        "Scalp Disorders (including Scalp Psoriasis, Eczema, Dermatitis or Infection)"
      ].includes(condition)
    ) ||
    finamino_sideeffects === "Yes - Minoxidil" ||
    hair_allergies.includes("Minoxidil/Propylene Glycol")
  ) {
    allowedTopicalMinoxidil = false;
    allowedTopicalCombo = false;
    logicExplanations["Scalp Conditions or Minoxidil Side Effects"] =
      "Topical Minoxidil is not recommended due to reported scalp conditions or side effects.";
  }
  
  // Cardiovascular Conditions Check
  if (
    existing_conditions.some(condition =>
      [
        "Cardiovascular Disease",
        "Heart Attack",
        "Rhythm",
        "Valve Disorder",
        "Stroke",
        "Cardiovascular Disease (incl. Heart Attack, Rhythm, Valve Disorder or Stroke)"
      ].includes(condition)
    )
  ) {
    allowedOralMinoxidil = false;
    allowedTopicalMinoxidil = false;
    allowedTopicalCombo = false;
    logicExplanations["Cardiovascular Conditions"] =
      "Minoxidil is not recommended due to cardiovascular conditions.";
  }

  if (overSixtyFive) {
    allowedOralFinasteride = false;
    allowedTopicalFinasteride = false;
    allowedOralMinoxidil = false;
    allowedTopicalCombo = false;
    logicExplanations["Age Over 65"] =
      "Finasteride and Oral Minoxidil are not recommended for customers over 65.";
  }

  // New Checks
  // 5) Apply new “Contraindication” checks
// -----------------------------------------------------------

// 5a) Hair loss started “Suddenly” => Contraindication for prescribing
//     5143 = 1 => "Suddenly"
if (hairLossOnset === 1) {
  // You might decide to block *everything* or just certain meds
  allowedOralFinasteride     = false;
  allowedTopicalFinasteride  = false;
  allowedOralMinoxidil       = false;
  allowedTopicalCombo        = false;
  logicExplanations["Sudden Hair Loss"] =
    "Medication not recommended due to sudden hair loss onset.";
}

// // 5b) Mood Issues: 3216 = 1 => “Yes” => Potential contradiction
// //     For the sake of example, we treat it as a block for Finasteride, or require further info
// if (moodIssues === 1) {
//   // For example, block Finasteride-based treatments
//   allowedOralFinasteride    = false;
//   allowedTopicalFinasteride = false;
//   allowedTopicalCombo       = false;
//   logicExplanations["Mood Issues"] =
//     "Finasteride not recommended due to reported mood/antidepressant use.";
// }

// 5c) PHQ questions (3275, 3276). If either is 2 or 3 => block Finasteride
if (littleInterest >= 2 || feelingDown >= 2) {
  allowedOralFinasteride    = false;
  allowedTopicalFinasteride = false;
  allowedTopicalCombo       = false;
  logicExplanations["PHQ Score"] =
    "Finasteride not recommended due to depressive symptoms.";
}

// 5d) Finasteride side effects => block Finasteride + Combo
//     5149 = 1 => "Yes"
if (finasterideSideEffects === 1) {
  allowedOralFinasteride    = false;
  allowedTopicalFinasteride = false;
  allowedTopicalCombo       = false;
  logicExplanations["Finasteride Side Effects"] =
    "Finasteride is not recommended due to reported side effects.";
}

// 5e) Minoxidil side effects => block Minoxidil + Combo
//     5151 = 1 => "Yes"
if (minoxidilSideEffects === 1) {
  allowedOralMinoxidil    = false;
  allowedTopicalMinoxidil = false;
  allowedTopicalCombo     = false;
  logicExplanations["Minoxidil Side Effects"] =
    "Minoxidil is not recommended due to reported side effects.";
}

// 5f) Topical combo side effects => at least block the combo
//     5153 = 1 => "Yes"
if (comboSideEffects === 1) {
  allowedTopicalCombo = false;
  logicExplanations["Combo Side Effects"] =
    "Topical combination not recommended due to reported side effects.";
}

// 5g) Existing Conditions from 5155
// ---------------------------------

// If user has Sexual Dysfunction => block Finasteride
if (existingConditions.includes(SEXUAL_DYSFUNCTION)) {
  allowedOralFinasteride    = false;
  allowedTopicalFinasteride = false;
  allowedTopicalCombo       = false;
  logicExplanations["Sexual Dysfunction"] =
    "Finasteride is not recommended due to potential impact on sexual dysfunction.";
}

// High Blood Pressure => can do an additional check if controlled vs. not
// For now, if HBP is present at all => block Minoxidil
if (existingConditions.includes(HIGH_BLOOD_PRESSURE)) {
  allowedOralMinoxidil    = false;
  allowedTopicalMinoxidil = false;
  allowedTopicalCombo     = false;
  logicExplanations["High Blood Pressure"] =
    "Minoxidil is not recommended due to hypertension.";
}

// Cardiovascular => block Minoxidil
if (existingConditions.includes(CARDIOVASCULAR)) {
  allowedOralMinoxidil    = false;
  allowedTopicalMinoxidil = false;
  allowedTopicalCombo     = false;
  logicExplanations["Cardiovascular"] =
    "Minoxidil not recommended due to cardiovascular disease.";
}

// Severe kidney/liver => block Finasteride (and possibly other meds, per your guidelines)
if (existingConditions.includes(SEVERE_KIDNEY_LIVER)) {
  allowedOralFinasteride    = false;
  allowedTopicalFinasteride = false;
  allowedTopicalCombo       = false;
  logicExplanations["Severe Kidney/Liver Disease"] =
    "Finasteride not recommended due to severe kidney or liver disease.";
}

// Prostate disease / male breast cancer / testicular cancer => block Finasteride
if (existingConditions.includes(PROSTATE_OR_CANCER)) {
  allowedOralFinasteride    = false;
  allowedTopicalFinasteride = false;
  allowedTopicalCombo       = false;
  logicExplanations["Prostate or Cancer"] =
    "Finasteride not recommended due to prostate/breast/testicular disease.";
}

// Rheumatoid / Lupus / Methotrexate => block Finasteride
if (existingConditions.includes(RHEUMATOID_LUPUS_MTX)) {
  allowedOralFinasteride    = false;
  allowedTopicalFinasteride = false;
  allowedTopicalCombo       = false;
  logicExplanations["Rheumatoid/Lupus/Methotrexate"] =
    "Finasteride not recommended due to autoimmune / immunosuppressant conditions.";
}

// Scalp disorders => block topical Minoxidil + combo
if (existingConditions.includes(SCALP_DISORDERS)) {
  allowedTopicalMinoxidil = false;
  allowedTopicalCombo     = false;
  logicExplanations["Scalp Disorders"] =
    "Topical Minoxidil is not recommended due to scalp condition.";
}

// Phaeochromocytoma => block Minoxidil
if (existingConditions.includes(PHAEOCHROMOCYTOMA)) {
  allowedOralMinoxidil    = false;
  logicExplanations["Phaeochromocytoma"] =
    "Oral-Minoxidil is not recommended due to potential cardiovascular complications.";
}

// Diagnosed Lactose Allergy => block oral Finasteride & oral Minoxidil
if (existingConditions.includes(LACTOSE_ALLERGY)) {
  allowedOralFinasteride = false;
  allowedOralMinoxidil   = false;
  logicExplanations["Lactose Allergy"] =
    "Oral Finasteride and Oral Minoxidil are not recommended due to lactose content.";
}

// 6) Block medications based on customer tags
// -------------------------------------------

if (tags.includes("finasteride_disallowed")) {
  allowedOralFinasteride = false;
  allowedTopicalFinasteride = false;
  allowedTopicalCombo = false;
  logicExplanations["Tag: finasteride_disallowed"] =
    "Finasteride is not recommended due to account restriction.";
}

if (tags.includes("minoxidil_disallowed")) {
  allowedOralMinoxidil = false;
  allowedTopicalMinoxidil = false;
  allowedTopicalCombo = false;
  logicExplanations["Tag: minoxidil_disallowed"] =
    "Minoxidil is not recommended due to account restriction.";
}
console.log(consultResults["Have you ever been diagnosed with any of the following?"]);
let diagnosedPreference    = consultResults["Have you ever been diagnosed with any of the following?"];
if(currentMarket === 'de'){
  diagnosedPreference = 'do-you-suffer-from-any-of-the-following';
}
if (diagnosedPreference === undefined || diagnosedPreference === 'undefined' || diagnosedPreference === null) {
    diagnosedPreference = [];
}

if (currentMarket === 'ie' && (diagnosedPreference.includes("Anxiety") || diagnosedPreference.includes("Depression"))) {
    allowedOralFinasteride = false;
    allowedTopicalFinasteride = false;
    allowedOralMinoxidil = true;
    allowedTopicalMinoxidil = true;
    allowedTopicalCombo = false;
}

if (currentMarket === 'ie' && (diagnosedPreference.includes("High blood pressure") || diagnosedPreference.includes("Significant Depression"))) {
    allowedOralFinasteride = true;
    allowedTopicalFinasteride = true;
    allowedOralMinoxidil = false;
    allowedTopicalMinoxidil = true;
    allowedTopicalCombo = true;
}

if (currentMarket === 'ie' && (diagnosedPreference.includes("Male breast cancer") || diagnosedPreference.includes("Prostate disease") || diagnosedPreference.includes("Testicular Cancer") || diagnosedPreference.includes("Significant Anxiety"))) {
    allowedOralFinasteride = false;
    allowedTopicalFinasteride = false;
    allowedOralMinoxidil = true;
    allowedTopicalMinoxidil = true;
    allowedTopicalCombo = false;
}

if (currentMarket === 'de' && (diagnosedPreference.includes("prostate-disease-male-breast-cancer-or-testicular-cancer") || diagnosedPreference.includes("significant-depression-or-anxiety"))) {
    allowedOralFinasteride = false;
    allowedTopicalFinasteride = false;
    allowedOralMinoxidil = true;
    allowedTopicalMinoxidil = true;
    allowedTopicalCombo = false;
}

if (currentMarket === 'de' && diagnosedPreference.includes("high-blood-pressure")) {
    allowedOralFinasteride = true;
    allowedTopicalFinasteride = true;
    allowedOralMinoxidil = false;
    allowedTopicalMinoxidil = true;
    allowedTopicalCombo = true;
}

// 6) Log or return the results
// -----------------------------------------------------------
console.log("allowedOralFinasteride:", allowedOralFinasteride);
console.log("allowedTopicalFinasteride:", allowedTopicalFinasteride);
console.log("allowedOralMinoxidil:", allowedOralMinoxidil);
console.log("allowedTopicalMinoxidil:", allowedTopicalMinoxidil);
console.log("allowedTopicalCombo:", allowedTopicalCombo);
console.log("logicExplanations:", logicExplanations);
// Filter recommendations
if (!allowedOralFinasteride) {
  recommendations = recommendations.filter((item) => 
    ![
      "ultimate-hair-loss-plan-capsule",
      "ultimate-hair-loss-plan",
      "oral-duo-plan",
      "ultimate-plan-capsule",
      "oral-duo-plan",
      "oral-capsule",
      "the-duo-plan",
      "finasteride",
      "combination-capsule",
      "dutasteride-combination-spray",
      "das-duo-programm",
      "der-duo-plan-tablette",
      "der-ultimative-plan",
      "der-ultimative-plan-tablette",
      "finasterid"
    ].includes(item)
  );
}

if (!allowedOralMinoxidil) {
  recommendations = recommendations.filter((item) => 
    ![
      "ultimate-hair-loss-plan-capsule",
      "ultimate-plan-capsule",
      "oral-duo-plan",
      "oral-capsule",
      "oral-duo-plan",
      "oral-minoxidil",
      "hair-loss-spray-hair-loss-capsule",
      "combination-capsule",
      "dutasteride-combination-spray",
      "der-duo-plan-tablette",
      "der-ultimative-plan",
      "der-ultimative-plan-tablette"
    ].includes(item)
  );
}

if (!allowedTopicalMinoxidil) {
  recommendations = recommendations.filter((item) => 
    ![
      "ultimate-hair-loss-plan",
      "the-duo-plan",
      "the-non-prescription-plan",
      "non-prescription-advanced",
      "minoxidil",
      "das-duo-programm",
      "der-ultimative-plan"
    ].includes(item)
  );
}

if (!allowedTopicalCombo) {
  recommendations = recommendations.filter((item) => 
    ![
      "topical-finasteride-minoxidil-spray"
    ].includes(item)
  );
}

if (!allowedTopicalFinasteride) {
  recommendations = recommendations.filter((item) => 
    ![
      "topical-hair-loss-spray",
      "hair-loss-spray-hair-loss-capsule"
    ].includes(item)
  );
}

// }

console.log("Recommendation: " + recommendations);

const recommendationContainer = document.getElementById("recommendation-main");

if (recommendationContainer) {
Promise.all(
  recommendations.map((rec) =>
    fetchProductDetails(rec).then((product) => ({
      handle: rec,
      product,
    }))
  )
).then((recommendationDetails) => {

  const combinedProducts = [];
  const processedHandles = new Set();
  // Track unique cards by a stable key derived from the product IDs inside the card
  const seenCardKeys = new Set();
  const makeCardKey = (ids) => ids.filter(Boolean).map(String).sort().join('+'); // order-insensitive key

  recommendationDetails.forEach((rec) => {
    if (processedHandles.has(rec.handle)) return;
    const pairedHandle = pairedProducts[rec.handle];
    const pairedProduct = pairedHandle
      ? recommendationDetails.find((r) => r.handle === pairedHandle)
      : null;

    if (pairedProduct) {
      // Key for a paired card: [capsule.id, spray.id] sorted
      const key = makeCardKey([
        rec.product && rec.product.id,
        pairedProduct.product && pairedProduct.product.id,
      ]);
      if (seenCardKeys.has(key)) {
        // We've already rendered this pairing elsewhere; skip
        processedHandles.add(rec.handle);
        processedHandles.add(pairedHandle);
        return;
      }
      combinedProducts.push(renderProductWithTabs(rec, pairedProduct));
      processedHandles.add(rec.handle);
      processedHandles.add(pairedHandle);
      seenCardKeys.add(key);
    } else {
      // Key for a single card
      const key = makeCardKey([rec.product && rec.product.id]);
      if (seenCardKeys.has(key)) {
        processedHandles.add(rec.handle);
        return;
      }

      if(typeof pairedProducts === 'object' && Object.keys(pairedProducts).length > 0 && currentMarket === 'de' && rec.handle !== 'finasterid' && rec.handle !== 'oral-minoxidil' && rec.handle !== 'das-rezeptfreie-programm-hgc'){
        return;
      }
      
      if(typeof pairedProducts === 'object' && Object.keys(pairedProducts).length === 1 && currentMarket === 'ie'  && rec.handle === 'minoxidil' && Object.values(pairedProducts).includes("minoxidil")){
        return;
      }
      
      
      if(typeof pairedProducts === 'object' && Object.keys(pairedProducts).length > 1 && currentMarket === 'ie'  && rec.handle !== 'finasteride'  && rec.handle !== 'hair-loss-spray-hair-loss-capsule' && rec.handle !== 'non-prescription-advanced'){
        return;
      }
      

      const excludeSingleProduct = [
        "ultimate-hair-loss-plan-capsule",
        "oral-duo-plan",
        "oral-minoxidil",
        "topical-hair-loss-spray"
      ];

      if(Object.keys(pairedProducts).length === 0 && currentMarket === 'ie' && excludeSingleProduct.includes(rec.handle)){
        return;
      }
      combinedProducts.push(renderProduct(rec));
      processedHandles.add(rec.handle);
      seenCardKeys.add(key);
    }
  });

  // Determine conditions for showing two products
  const showTwoProducts = allowedOralFinasteride && allowedTopicalMinoxidil;

 // Don’t mutate combinedProducts
const primary = showTwoProducts
  ? (answeredQuestion
      ? combinedProducts.slice(0, 2)
      : combinedProducts.slice(0, 2))
  : combinedProducts.slice(0, 1);

const additional = combinedProducts.slice(primary.length);

const primaryRecommendations = primary;
const extraRecommendations = additional;

const primaryProductHandles = primaryRecommendations.map(
  (rec) => rec.handle
);

  // Fetch and update the currentProductTags for each primary recommendation
  primaryProductHandles.forEach((primaryProductHandle) => {
    fetch(`/products/${primaryProductHandle}.js`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch product details for handle: ${primaryProductHandle}`
          );
        }
        return response.json();
      })
      .then((product) => {
        if (!product || !product.tags) {
          throw new Error("Product or tags are missing from the response.");
        }

        const tags = product.tags || [];
        const filteredTags = tags
          .filter((tag) => tag.toLowerCase().startsWith("contains:")) // Keep only tags starting with "contains:"
          .map((tag) => {
            let ingredient = tag.replace(/^contains:\s*/i, "").trim(); // Remove "contains:" prefix and trim whitespace
            return ingredient.replace(/^oral-/i, ""); // Remove "oral-" prefix
          });

        // Store filtered tags in sessionStorage
        sessionStorage.setItem(
          `currentProductTags_${primaryProductHandle}`,
          JSON.stringify(filteredTags)
        );

        // Perform the check for the Add to Cart button state
        checkForMatchingProducts();
      })
      .catch((error) => {
        console.error("Error fetching primary product tags:", error);
      });
  });

  // Additional recommendations
  additionalRecommendations = additional;

  // Generate HTML for primary and additional recommendations
  const primaryRecommendationsHTML = primaryRecommendations
    .map(
      (productHTML) => `
        <li class="col ${
          !showTwoProducts ? "span_3_of_3" : "span_1_of_2"
        }">
          ${productHTML}
        </li>
      `
    )
    .join("");

   additionalRecommendationsHTML = additionalRecommendations
    .map(
      (productHTML) => `
        <li class="col span_1_of_3">
          ${productHTML}
        </li>
      `
    )
    .join("");

  recommendationContainer.innerHTML = `
    <div class="group"><div class="col span_1_of_3">
          
          
            
              <h2 class="h1">${customerFirstName}'s Hair Growth Recommendations</h2>
            
            <p style="padding-bottom: 20px !important;">
              
                Based on your responses in the consultation, our medical team recommend the following plan for you:
              
            </p>
          

            </div></div><ul id="primaryRecommendations" class="group">
      ${primaryRecommendationsHTML}
    </ul>
    ${
      additionalRecommendations.length > 0
        ? `
        <div class="see-more-plans-container"><a href="#" id="see-more-plans">See more plans</a></div>
        <ul id="additional-recommendations" class="group" style="display: none;">
        <div class="add_items">
          ${additionalRecommendationsHTML}
        </div>
        </ul>
        `
        : ""
    }
    <div id="recommendation-reasoning" style="display: none;">
      <h4><span style="color: red">Debug (Dev Only)</span>
        ${
          Object.entries(logicExplanations).length > 0
            ? Object.entries(logicExplanations)
                .map(
                  ([condition, explanation]) =>
                    `<span><strong>${condition}: </strong><i>${explanation}</i></span>`
                )
                .join("")
            : ""
        }
      </h4>
    </div>
  `;

  
    const widget = document.querySelector(".trustpilot-widget-reco");
    if (widget) {
      widget.style.visibility = "visible";
    }
  

    // Add "See More Plans" functionality
    let seeMoreText = 'See more plans';
    
    let hidePlanText = 'Hide plans';
    
    const seeMoreLink = document.getElementById("see-more-plans");
    if (seeMoreLink) {
      seeMoreLink.addEventListener("click", (event) => {
        event.preventDefault();
        const additionalList = document.getElementById(
          "additional-recommendations"
        );
        additionalList.style.display =
          additionalList.style.display === "none" ? "block" : "none";
        seeMoreLink.textContent =
