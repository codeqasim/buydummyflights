// MAJOR AIRPORTS FOR THE ORDER FORM'S DATALIST. IATA CODES ARE PUBLIC FACTS. EXTEND FREELY; `label` IS WHAT THE USER TYPES AND SEES.
export type Airport = { iata: string; city: string; country: string }

export const airports: Airport[] = [
  ['LHR', 'London', 'United Kingdom'], ['CDG', 'Paris', 'France'], ['AMS', 'Amsterdam', 'Netherlands'],
  ['FRA', 'Frankfurt', 'Germany'], ['MUC', 'Munich', 'Germany'], ['BER', 'Berlin', 'Germany'],
  ['MAD', 'Madrid', 'Spain'], ['BCN', 'Barcelona', 'Spain'], ['FCO', 'Rome', 'Italy'],
  ['MXP', 'Milan', 'Italy'], ['ZRH', 'Zurich', 'Switzerland'], ['VIE', 'Vienna', 'Austria'],
  ['BRU', 'Brussels', 'Belgium'], ['LIS', 'Lisbon', 'Portugal'], ['ATH', 'Athens', 'Greece'],
  ['CPH', 'Copenhagen', 'Denmark'], ['ARN', 'Stockholm', 'Sweden'], ['OSL', 'Oslo', 'Norway'],
  ['HEL', 'Helsinki', 'Finland'], ['WAW', 'Warsaw', 'Poland'], ['PRG', 'Prague', 'Czechia'],
  ['IST', 'Istanbul', 'Turkey'], ['DXB', 'Dubai', 'United Arab Emirates'], ['AUH', 'Abu Dhabi', 'United Arab Emirates'],
  ['DOH', 'Doha', 'Qatar'], ['JED', 'Jeddah', 'Saudi Arabia'], ['RUH', 'Riyadh', 'Saudi Arabia'],
  ['CAI', 'Cairo', 'Egypt'], ['JNB', 'Johannesburg', 'South Africa'], ['NBO', 'Nairobi', 'Kenya'],
  ['LOS', 'Lagos', 'Nigeria'], ['JFK', 'New York', 'United States'], ['LAX', 'Los Angeles', 'United States'],
  ['ORD', 'Chicago', 'United States'], ['MIA', 'Miami', 'United States'], ['YYZ', 'Toronto', 'Canada'],
  ['YVR', 'Vancouver', 'Canada'], ['MEX', 'Mexico City', 'Mexico'], ['GRU', 'São Paulo', 'Brazil'],
  ['SYD', 'Sydney', 'Australia'], ['MEL', 'Melbourne', 'Australia'], ['AKL', 'Auckland', 'New Zealand'],
  ['SIN', 'Singapore', 'Singapore'], ['KUL', 'Kuala Lumpur', 'Malaysia'], ['BKK', 'Bangkok', 'Thailand'],
  ['HKG', 'Hong Kong', 'Hong Kong'], ['NRT', 'Tokyo', 'Japan'], ['ICN', 'Seoul', 'South Korea'],
  ['DEL', 'Delhi', 'India'], ['BOM', 'Mumbai', 'India'], ['KHI', 'Karachi', 'Pakistan'],
  ['LHE', 'Lahore', 'Pakistan'], ['ISB', 'Islamabad', 'Pakistan'], ['DAC', 'Dhaka', 'Bangladesh'],
  ['CMB', 'Colombo', 'Sri Lanka'],
].map(([iata, city, country]) => ({ iata: iata!, city: city!, country: country! }))

export const airportLabel = (a: Airport): string => `${a.city} (${a.iata})`
