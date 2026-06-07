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

export const exportInvoiceToTXT = (invoice) => {
  if (!invoice) {
    alert("No invoice data to export.");
    return;
  }

  const order = invoice.order || {};
  const customer = order.customer || {};
  const items = order.items || [];
  
  const issueDateStr = invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : 'N/A';
  const dueDateStr = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A';

  let txtContent = `==================================================\n`;
  txtContent += `                 SCM SYSTEM RECEIPT\n`;
  txtContent += `==================================================\n`;
  txtContent += `Invoice ID   : ${invoice.id}\n`;
  txtContent += `Order ID     : ${order.id || 'N/A'}\n`;
  txtContent += `Date         : ${issueDateStr}\n`;
  txtContent += `Due Date     : ${dueDateStr}\n`;
  txtContent += `--------------------------------------------------\n`;
  txtContent += `Customer     : ${customer.name || 'Unknown'}\n`;
  txtContent += `Email        : ${customer.email || 'N/A'}\n`;
  txtContent += `Phone        : ${customer.contactNumber || 'N/A'}\n`;
  txtContent += `--------------------------------------------------\n`;
  txtContent += `Items Details:\n`;
  
  if (items.length > 0) {
    items.forEach(item => {
      const prodName = item.product ? item.product.name : 'Unknown Product';
      txtContent += `  - ${prodName} (x${item.quantity}) @ $${item.unitPrice} = $${item.subtotal}\n`;
    });
  } else {
    txtContent += `  No items found.\n`;
  }
  
  txtContent += `--------------------------------------------------\n`;
  txtContent += `Total Amount : $${invoice.amount}\n`;
  txtContent += `Status       : ${invoice.status || 'Pending'}\n`;
  txtContent += `==================================================\n`;
  txtContent += `         Thank you for your business!\n`;
  txtContent += `==================================================\n`;

  // Create blob and download
  const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `invoice_${invoice.id}.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

