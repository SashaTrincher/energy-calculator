const waterTriggerElem = document.getElementById('waterCalcTrigger');
const outputElem = document.getElementById('processOutput');

function roundNumber(num, decimalPlaces) {
    return Number(Math.round(num + 'e' + decimalPlaces) + 'e-' + decimalPlaces);
};

function errorCheck(target, unit) {
    if (target === '') {
        alert(`Please input a valid number in ${unit}`);
        throw new Error('Field is empty');
    }

    if (isNaN(target) || !/^\d+(\.\d+)?$/.test(target.toString())) {
        alert(`Please input a valid number in ${unit}`);
        throw new Error('input is NaN or contains non-numeric characters');
    } 

    if (target <= 0) {
        alert(`Please input a valid number in ${unit} that exceeds zero`);
        throw new Error('Number is zero or less than zero');
    }
};

function waterEfficencyCalc () {
    const waterMassGrams = parseFloat(document.getElementById('waterValue').value);
    const waterMolecularWeight = 18.01528;

    errorCheck(waterMassGrams, 'grams')

    const molesOfWater = waterMassGrams / waterMolecularWeight;

    const molecularHydrogenWeight = 2.01588;
    const hydrogenMassGrams = molesOfWater * molecularHydrogenWeight;
    const hydrogenMassKilos = hydrogenMassGrams / 1000;

    const hydrogenHhvKjPerKg = 141829.6; 
    const kjToKwh = 1 / 3600; 

    const energyContentKwh = hydrogenHhvKjPerKg * hydrogenMassKilos * kjToKwh;

    const gasTurbineEfficiency = 0.595; // H-100 Gas Turbines Combined Cycle Performance 2 on 1
    const electricityGeneratedKwh = energyContentKwh * gasTurbineEfficiency;

    console.log(electricityGeneratedKwh);
    outputElem.textContent = `Approximately: ${roundNumber(electricityGeneratedKwh, 2)} kWh`;
};

waterTriggerElem.addEventListener('click', () => {
    waterTriggerElem.disabled = true;
    try {
        waterEfficencyCalc();
    } catch (error) {
        console.error(error);
    }
    waterTriggerElem.disabled = false;
});

const powerTriggerElem = document.getElementById('powerCalcTrigger');

function calcWaterNeeded (value) {
    const targetElectricityKwh = value;
    const gasTurbineEfficiency = 0.595; // H-100 Gas Turbines Combined Cycle Performance 2 on 1
    
    const initialEnergyContentKwh = targetElectricityKwh / gasTurbineEfficiency;

    const hydrogenHhvKjPerKg = 141829.6;
    const kjToKwh = 1 / 3600;

    const hydrogenMassKilos = initialEnergyContentKwh / (hydrogenHhvKjPerKg * kjToKwh);

    const molecularHydrogenWeight = 2.01588;
    const molesOfHydrogen = hydrogenMassKilos * 1000 / molecularHydrogenWeight;

    const waterMolecularWeight = 18.01528;
    const waterMassGrams = molesOfHydrogen * waterMolecularWeight;
    const waterMassLiters = waterMassGrams / 1000;

    outputElem.textContent = `Approximately ${roundNumber(waterMassLiters, 2)} liters of water`;
    console.log(waterMassGrams);
    console.log(waterMassLiters);
};

powerTriggerElem.addEventListener('click', () => {
    powerTriggerElem.disabled = true;
    try {
        const powerInput = parseFloat(document.getElementById('energyInput').value);
        errorCheck(powerInput, 'kWh');
        calcWaterNeeded(powerInput);
    } catch (error) {
        console.error(error);
    }
    powerTriggerElem.disabled = false;
});