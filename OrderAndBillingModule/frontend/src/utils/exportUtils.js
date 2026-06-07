export const exportOrdersToCSV = (orders) => {
  if (!orders || orders.length === 0) {
    alert("No data to export.");
    return;
  }

  // Define CSV headers
  const headers = ['Order ID', 'Customer Name', 'Order Date', 'Total Amount', 'Status'];
  
  // Convert orders data to CSV rows
  const csvRows = orders.map(order => {
    const customerName = order.customer ? order.customer.name : 'Unknown';
    const orderDate = order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A';
    return `${order.id},"${customerName}",${orderDate},${order.totalAmount},${order.status}`;
  });

  // Combine headers and rows
  const csvContent = [headers.join(','), ...csvRows].join('\n');

  // Create a Blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'sales_report.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
