import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface OrderDetailModalProps {
  order: any;
  onClose: () => void;
  onComplete: (orderId: string) => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose, onComplete }) => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(`Order: ${order.id}`, 14, 22);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 14, 32);
    doc.text(`Customer Name: ${order.customerName}`, 14, 40);
    doc.text(`Total Amount: ${order.totalPrice.toLocaleString()} VND`, 14, 48);

    doc.autoTable({
      startY: 60,
      head: [["Product Name", "Quantity", "Price", "Total"]],
      body: order.items.map((item: any) => [
        item.name,
        item.quantity,
        `${item.price.toLocaleString()} VND`,
        `${(item.quantity * item.price).toLocaleString()} VND`,
      ]),
    });

    doc.save(`order_${order.id}_details.pdf`);
  };

  return (
    <Modal isOpen={!!order} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Order Details</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer Name</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium">{order.totalPrice.toLocaleString()} VND</p>
            </div>
          </div>
          <Table aria-label="Order items" className="mt-4">
            <TableHeader>
              <TableColumn>Product Name</TableColumn>
              <TableColumn>Quantity</TableColumn>
              <TableColumn>Price</TableColumn>
              <TableColumn>Total</TableColumn>
            </TableHeader>
            <TableBody>
              {order.items.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price.toLocaleString()} VND</TableCell>
                  <TableCell>{(item.quantity * item.price).toLocaleString()} VND</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={handleDownloadPDF}>
            Download PDF
          </Button>
          {order.status !== 'Completed' && (
            <Button color="success" onPress={() => onComplete(order.id)}>
              Complete Order
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrderDetailModal;

