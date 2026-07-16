"use client";

interface Price {
  id: string;
  source: string;
  source_logo: string;
  price: number;
  in_stock: boolean;
  free_ship: boolean;
  url: string;
  affiliate_url: string;
  scraped_at: string;
}

export default function PriceCompareTable({ prices }: { prices: Price[] }) {
  if (!prices || prices.length === 0) {
    return (
      <div className="card-glass p-6 text-center text-slate-500 text-sm">
        Henüz fiyat verisi bulunamadı.
      </div>
    );
  }

  const inStock = prices.filter((p) => p.in_stock);
  const outOfStock = prices.filter((p) => !p.in_stock);
  const sorted = [...inStock, ...outOfStock];
  const minPrice = inStock[0]?.price;

  return (
    <div className="card-glass overflow-hidden">
      <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <h2 className="font-bold text-white text-sm">
          🏷️ Fiyat Karşılaştırma
          <span className="ml-2 text-slate-500 font-normal text-xs">{prices.length} site</span>
        </h2>
        <span className="text-xs text-slate-500">Günde 3× güncellenir</span>
      </div>

      <div className="overflow-x-auto">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Mağaza</th>
              <th>Fiyat</th>
              <th>Stok</th>
              <th>Kargo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((price, idx) => {
              const isBest = price.price === minPrice && price.in_stock;
              return (
                <tr key={price.id} style={{ opacity: price.in_stock ? 1 : 0.5 }}>
                  {/* Mağaza */}
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: `hsl(${(idx * 47) % 360}, 60%, 40%)` }}>
                        {price.source.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-200">{price.source}</span>
                    </div>
                  </td>

                  {/* Fiyat */}
                  <td>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold text-base ${isBest ? "text-green-400" : "text-slate-100"}`}>
                        {price.price.toLocaleString("tr-TR")}₺
                      </span>
                      {isBest && <span className="badge-best-price">En İyi</span>}
                    </div>
                  </td>

                  {/* Stok */}
                  <td>
                    {price.in_stock ? (
                      <span className="text-green-400 text-xs font-semibold">✓ Var</span>
                    ) : (
                      <span className="badge-out-of-stock">Tükendi</span>
                    )}
                  </td>

                  {/* Kargo */}
                  <td>
                    {price.free_ship ? (
                      <span className="badge-free-ship">Ücretsiz</span>
                    ) : (
                      <span className="text-slate-500 text-xs">Ücretli</span>
                    )}
                  </td>

                  {/* Link */}
                  <td>
                    {price.in_stock && (
                      <a
                        href={price.affiliate_url || price.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        id={`buy-link-${price.id}`}
                        className="btn-primary text-xs py-1.5 px-4 no-underline inline-block"
                      >
                        Satın Al
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Son güncelleme */}
      {prices[0]?.scraped_at && (
        <div className="px-4 py-2 text-xs text-slate-600" style={{ borderTop: "1px solid var(--color-border)" }}>
          Son güncelleme: {new Date(prices[0].scraped_at).toLocaleString("tr-TR")}
        </div>
      )}
    </div>
  );
}
