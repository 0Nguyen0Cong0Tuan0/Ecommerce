const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const OPEN_ROUTE_SERVICE_API_KEY = process.env.OPEN_ROUTE_SERVICE_API_KEY;
const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;

const calculateShippingFee = async (info, shippingMethod) => {
    const street = info.house;
    const city = info.town_city;
    const country = info.country;

    if (!street || !city || !country) {
        throw new Error('Invalid address');
    }

    const destination = `${street}, ${city}, ${country}`;
    const origin = process.env.STARTED_PLACE;

    console.log('Origin:', origin);
    console.log('Destination:', destination);

    // Get coordinates for origin and destination
    const originCoordinates = await getCoordinates(origin);
    const destinationCoordinates = await getCoordinates(destination);

    console.log('Origin Coordinates:', originCoordinates);
    console.log('Destination Coordinates:', destinationCoordinates);

    // If coordinates are very far apart (cross-continental), call Amadeus API
    const isCrossContinent = detectCrossContinent(originCoordinates, destinationCoordinates);
    if (isCrossContinent) {
        console.log('Cross-continent route detected. Fetching flight details from Amadeus API...');
        return await getFlightDetails(origin, destination);
    }

    // Construct the request URL for the OpenRouteService Distance Matrix API
    const url = `https://api.openrouteservice.org/v2/matrix/driving-car`;

    const body = {
        locations: [
            originCoordinates,     // Origin coordinates
            destinationCoordinates  // Destination coordinates
        ],
        metrics: ['distance', 'duration']
    };

    try {
        const response = await axios.post(url, body, {
            headers: {
                'Authorization': OPEN_ROUTE_SERVICE_API_KEY,
            }
        });

        console.log('API Response:', response.data);

        // Check if the request was successful
        if (response.status !== 200) {
            throw new Error('Failed to fetch data from OpenRouteService');
        }

        const result = response.data;
        const distance = result.distances[0][1]; // Distance in meters
        const timeEstimate = result.durations[0][1]; // Time in seconds

        // Handle cases where distance or timeEstimate is null
        if (distance === null || timeEstimate === null) {
            console.error('Could not calculate distance or time. Fetching flight details from Amadeus API...');
            return await getFlightDetails(origin, destination);
        }

        console.log('Distance:', distance);
        console.log('Time Estimate (seconds):', timeEstimate);

        // Calculate shipping fee based on the method
        let shippingFee;
        let timeEstimateFormatted;

        switch (shippingMethod) {
            case 'standard':
                shippingFee = 10 + distance * 0.0005; // Example: $0.50 per kilometer
                timeEstimateFormatted = `${Math.floor(timeEstimate / 60)} minutes`; // Convert seconds to minutes
                break;
            case 'express':
                shippingFee = 15 + distance * 0.001; // Example: $1.00 per kilometer for express
                timeEstimateFormatted = `${Math.floor((timeEstimate - 360) / 60)} minutes`; // Express is assumed to be 6 minutes faster (360 seconds)
                break;
            case 'pickup':
                shippingFee = 0; // No shipping fee for pickup
                timeEstimateFormatted = `0 minutes`; // Pickup has no delivery time
                break;
            default:
                shippingFee = 0;
                timeEstimateFormatted = 'N/A';
        }
        
        // Return the shipping fee and time estimate
        return { shippingFee, timeEstimate: timeEstimateFormatted };
    } catch (error) {
        console.error('Error calling OpenRouteService API:', error);
        throw new Error('Failed to calculate shipping fee');
    }
};


// Helper function to get coordinates from the address
const getCoordinates = async (address) => {
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${OPEN_ROUTE_SERVICE_API_KEY}&text=${encodeURIComponent(address)}`;

    try {
        const response = await axios.get(url);
        const result = response.data;

        if (result.features.length === 0) {
            throw new Error('No coordinates found for the provided address.');
        }

        // Extract latitude and longitude from the first feature
        const [longitude, latitude] = result.features[0].geometry.coordinates;

        return [longitude, latitude];
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw new Error('Failed to get coordinates for the address');
    }
};

// Helper function to detect if the route crosses continents
const detectCrossContinent = (originCoordinates, destinationCoordinates) => {
    const [originLong, originLat] = originCoordinates;
    const [destLong, destLat] = destinationCoordinates;

    // Very basic check: compare longitude to determine if the locations are on different continents
    // (This is a rough estimate and can be refined)
    return Math.abs(originLong - destLong) > 40; // Example threshold for continental difference
};

// Helper function to calculate a flat rate for long-distance routes
const calculateFlatRateForLongDistance = (shippingMethod) => {
    switch (shippingMethod) {
        case 'standard':
            return 50; // Flat rate for standard international shipping
        case 'express':
            return 100; // Flat rate for express international shipping
        default:
            return 0;
    }
};

module.exports = calculateShippingFee;
