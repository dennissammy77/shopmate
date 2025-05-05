// Mock data source for price comparison
const mockStores = ['Walmart', 'Target', 'Costco', 'Amazon'];

exports.fetchMockPrices = async (productName) => {
  const prices = mockStores.map((store) => {
    const randomPrice = (Math.random() * 10 + 1).toFixed(2); // $1–$11
    return {
      storeName: store,
      price: parseFloat(randomPrice),
      currency: 'USD',
      lastChecked: new Date()
    };
  });

  return prices;
};
