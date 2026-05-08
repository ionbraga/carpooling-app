const moldovaCities = [
  'Chișinău',
  'Bălți',
  'Tiraspol',
  'Bender',
  'Rîbnița',
  'Cahul',
  'Ungheni',
  'Soroca',
  'Orhei',
  'Dubăsari',
  'Comrat',
  'Edineț',
  'Strășeni',
  'Căușeni',
  'Hîncești',
  'Drochia',
  'Ialoveni',
  'Florești',
  'Cimișlia',
  'Fălești',
  'Glodeni',
  'Rezina',
  'Taraclia',
  'Nisporeni',
  'Ocnița',
  'Sîngerei',
  'Șoldănești',
  'Telenești',
  'Leova',
  'Criuleni',
  'Dondușeni',
  'Briceni',
  'Rîșcani',
  'Anenii Noi',
  'Ștefan Vodă',
  'Cantemir',
  'Basarabeasca',
  'Călărași',
  'Vulcănești',
  'Ceadîr-Lunga',
  'Cupcini',
  'Otaci',
  'Camenca',
  'Iargara',
  'Costești',
  'Vadul lui Vodă',
  'Codru',
  'Durlești',
  'Sîngera',
  'Vatra',
  'Cricova',
];

const normalizeCity = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');

const cityMap = new Map(moldovaCities.map((city) => [normalizeCity(city), city]));

const isKnownMoldovaCity = (city) => cityMap.has(normalizeCity(city));

const getMoldovaCityLabel = (city) => cityMap.get(normalizeCity(city));

module.exports = {
  moldovaCities,
  isKnownMoldovaCity,
  getMoldovaCityLabel,
  normalizeCity,
};