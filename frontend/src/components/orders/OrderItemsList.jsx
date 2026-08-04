import React from 'react';

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

function OrderItemRow({ item }) {
  const {
    id,
    product_name,
    sku_name,
    image_url,
    quantity,
    unit_price,
    total_price,
  } = item;

  const lineTotal =
    total_price !== undefined && total_price !== null
      ? total_price
      : unit_price !== undefined && unit_price !== null && quantity
      ? unit_price * quantity
      : null;

  return (
    <tr key={id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-100">
      <td className="py-3 pl-4 pr-3">
        <div className="flex items-center gap-3">
          {image_url ? (
            <img
              src={image_url}
              alt={product_name || ''}
              className="w-12 h-12 rounded-md object-cover flex-shrink-0 border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
              <span className="text-gray-300 text-xs">No img</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {product_name || '—'}
            </p>
            {sku_name && (
              <p className="text-xs text-gray-500 mt-0.5 truncate">{sku_name}</p>
            )}
          </div>
        </div>
      </td>
      <td className="py-3 px-3 text-sm text-gray-700 text-right whitespace-nowrap">
        {unit_price !== undefined && unit_price !== null
          ? formatCurrency(unit_price)
          : '—'}
      </td>
      <td className="py-3 px-3 text-sm text-gray-700 text-right whitespace-nowrap">
        {quantity !== undefined && quantity !== null ? quantity : '—'}
      </td>
      <td className="py-3 pl-3 pr-4 text-sm font-semibold text-gray-900 text-right whitespace-nowrap">
        {lineTotal !== null ? formatCurrency(lineTotal) : '—'}
      </td>
    </tr>
  );
}

export default function OrderItemsList({ items, subtotal, discount, shipping_charge, total_amount }) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        No items found for this order.
      </div>
    );
  }

  const showSummary =
    subtotal !== undefined ||
    discount !== undefined ||
    shipping_charge !== undefined ||
    total_amount !== undefined;

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200" aria-label="Order items">
        <thead>
          <tr className="bg-gray-50">
            <th
              scope="col"
              className="py-2.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Product
            </th>
            <th
              scope="col"
              className="py-2.5 px-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Unit Price
            </th>
            <th
              scope="col"
              className="py-2.5 px-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Qty
            </th>
            <th
              scope="col"
              className="py-2.5 pl-3 pr-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {items.map((item, index) => (
            <OrderItemRow key={item.id || index} item={item} />
          ))}
        </tbody>
      </table>

      {showSummary && (
        <div className="mt-4 border-t border-gray-200 pt-4 space-y-2">
          {subtotal !== undefined && subtotal !== null && (
            <div className="flex justify-between text-sm text-gray-600 px-4">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          )}
          {discount !== undefined && discount !== null && discount > 0 && (
            <div className="flex justify-between text-sm text-green-700 px-4">
              <span>Discount</span>
              <span>- {formatCurrency(discount)}</span>
            </div>
          )}
          {shipping_charge !== undefined && shipping_charge !== null && (
            <div className="flex justify-between text-sm text-gray-600 px-4">
              <span>Shipping</span>
              <span>
                {shipping_charge === 0
                  ? 'Free'
                  : formatCurrency(shipping_charge)}
              </span>
            </div>
          )}
          {total_amount !== undefined && total_amount !== null && (
            <div className="flex justify-between text-sm font-semibold text-gray-900 border-t border-gray-200 pt-2 mt-2 px-4">
              <span>Order Total</span>
              <span>{formatCurrency(total_amount)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
