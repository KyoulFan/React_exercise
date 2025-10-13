function InventoryItem({name, type, quantity = 0, price = 0 }) {
  const lowStock = 5;
  const highValue = 1000;

  const totalValue = quantity * price;
}
return (
  <div className="inventory-item">
    <h2>
      {name}({type})
    </h2>
    {quantity < lowStock && (
      <Message>
        <p>
          <span>⚠️</span>Low Stock! {quantity} remained.
        </p>
      </Message>
    )}
    {totalValue > highValue && (
      <Message>
        <p>
          <span>💰</span>High value - consider extra protection!
        </p>
      </Message>
    )}
  </div>
);
