class Order {
    constructor(id, side, price, quantity) {
        this.id = id;
        this.side = side;
        this.price = price;
        this.quantity = quantity;
    }
}

class OrderBook {
    constructor() {
        this.buyOrders = [];
        this.sellOrders = [];
    }

    addOrder(order) {
        if (order.side === 'buy') {
            this.buyOrders.push(order);
        } else if (order.side === 'sell') {
            this.sellOrders.push(order);
        }
    }

    executeOrder() {
        let matches = [];
        for (let i = 0; i < this.buyOrders.length; i++) {
            for (let j = 0; j < this.sellOrders.length; j++) {
                if (this.buyOrders[i].price >= this.sellOrders[j].price) {
                    if (this.buyOrders[i].quantity == this.sellOrders[j].quantity) {
                        matches.push({
                            buy: this.buyOrders[i],
                            sell: this.sellOrders[j]
                        });
                        this.buyOrders.splice(i, 1);
                        this.sellOrders.splice(j, 1);
                        i--;
                        break;
                    } else if (this.buyOrders[i].quantity < this.sellOrders[j].quantity) {
                        matches.push({
                            buy: this.buyOrders[i],
                            sell: this.sellOrders[j]
                        });
                        this.sellOrders[j].quantity -= this.buyOrders[i].quantity;
                        this.buyOrders.splice(i, 1);
                        i--;
                        break;
                    } else {
                        matches.push({
                            buy: this.buyOrders[i],
                            sell: this.sellOrders[j]
                        });
                        this.buyOrders[i].quantity -= this.sellOrders[j].quantity;
                        this.sellOrders.splice(j, 1);
                    }
                }
            }
        }
        return matches;
    }

    getBestBid(n = 0, buyOrd) {

        if (this.sellOrders.length === 0) {
            console.log("No sell orders in the book");
            return;
        }
        if (n >= this.sellOrders.length) {
            console.log(`There are only ${this.sellOrders.length} sell orders in the book. Please enter a valid number`);
            return;
        }
        let bestBid;
        let sortedBuyOrders = [...this.buyOrders].sort((a, b) => b.price - a.price);
        if (n < sortedBuyOrders.length) {
            bestBid = sortedBuyOrders[n];
        }
        return bestBid;

    }

    getBestAsk(n = 0) {
        if (this.sellOrders.length === 0) {
            console.log("No sell orders in the book");
            return;
        }
        if (n >= this.sellOrders.length) {
            console.log(`There are only ${this.sellOrders.length} sell orders in the book. Please enter a valid number`);
            return;
        }
        let tempSellOrders = [...this.sellOrders];
        tempSellOrders.sort((a, b) => a.price - b.price);
        return tempSellOrders[n];
    }

    getOrderBook() {
        return {
            buyOrders: this.buyOrders,
            sellOrders: this.sellOrders
        }
    }

    removeBuyOrder(id) {
        this.buyOrders = this.buyOrders.filter(order => order.id !== id);
    }

    removeSellOrder(id) {
        this.sellOrders = this.sellOrders.filter(order => order.id !== id);
    }

    updateOrder(id, price, quantity, side) {
        let orders = side === 'buy' ? this.buyOrders : this.sellOrders;
        let orderIndex = orders.findIndex(order => order.id === id);
        if (orderIndex !== -1) {
            orders[orderIndex].price = price;
            orders[orderIndex].quantity = quantity;
        } else {
            console.log("Order not found to update");
        }
    }


}

function Test() {
    let order1 = new Order(1, "buy", 100, 10);
    let order2 = new Order(2, "buy", 90, 15);
    let order3 = new Order(3, "buy", 80, 20);
    let order4 = new Order(4, "sell", 110, 5);
    let order5 = new Order(5, "sell", 120, 10);
    let order6 = new Order(6, "sell", 130, 15);

    let orderBook = new OrderBook();
    orderBook.addOrder(order1);
    orderBook.addOrder(order2);
    orderBook.addOrder(order3);
    orderBook.addOrder(order4);
    orderBook.addOrder(order5);
    orderBook.addOrder(order6);

    console.log("Best Bid", orderBook.getBestBid(0, orderBook.getOrderBook().buyOrders));  // { id: 1, side: 'buy', price: 100, quantity: 10 }
    console.log("2nd best bid", orderBook.getBestBid(1, orderBook.getOrderBook().buyOrders)); // { id: 2, side: 'buy', price: 90, quantity: 15 }
    console.log("Best ask", orderBook.getBestAsk(0, orderBook.getOrderBook().sellOrders));  // { id: 4, side: 'sell', price: 110, quantity: 5 }
    console.log("2nd best ask", orderBook.getBestAsk(1, orderBook.getOrderBook().sellOrders)); // { id: 5, side: 'sell', price: 120, quantity: 10 }
    console.log("complete order book", orderBook.getOrderBook()); 
    /*
        {
  buyOrders: [
    Order { id: 1, side: 'buy', price: 100, quantity: 10 },
    Order { id: 2, side: 'buy', price: 90, quantity: 15 },
    Order { id: 3, side: 'buy', price: 80, quantity: 20 }
  ],
  sellOrders: [
    Order { id: 4, side: 'sell', price: 110, quantity: 5 },
    Order { id: 5, side: 'sell', price: 120, quantity: 10 },
    Order { id: 6, side: 'sell', price: 130, quantity: 15 }
  ]
}
    */

    console.log("Order exexuted");
    orderBook.executeOrder();
    console.log(orderBook.getOrderBook()); 
    /* 
    {
  buyOrders: [
    Order { id: 1, side: 'buy', price: 100, quantity: 10 },
    Order { id: 2, side: 'buy', price: 90, quantity: 15 },
    Order { id: 3, side: 'buy', price: 80, quantity: 20 }
  ],
  sellOrders: [
    Order { id: 4, side: 'sell', price: 110, quantity: 5 },
    Order { id: 5, side: 'sell', price: 120, quantity: 10 },
    Order { id: 6, side: 'sell', price: 130, quantity: 15 }
  ]
} */

    orderBook.removeBuyOrder(1);
    console.log(orderBook.getOrderBook()); 

    /* {
  buyOrders: [
    Order { id: 2, side: 'buy', price: 90, quantity: 15 },
    Order { id: 3, side: 'buy', price: 80, quantity: 20 }
  ],
  sellOrders: [
    Order { id: 4, side: 'sell', price: 110, quantity: 5 },
    Order { id: 5, side: 'sell', price: 120, quantity: 10 },
    Order { id: 6, side: 'sell', price: 130, quantity: 15 }
  ]
} */

    orderBook.removeSellOrder(4);
    console.log(orderBook.getOrderBook()); 

    /* 
    {
  buyOrders: [
    Order { id: 2, side: 'buy', price: 90, quantity: 15 },
    Order { id: 3, side: 'buy', price: 80, quantity: 20 }
  ],
  sellOrders: [
    Order { id: 5, side: 'sell', price: 120, quantity: 10 },
    Order { id: 6, side: 'sell', price: 130, quantity: 15 }
  ]
} */

     orderBook.updateOrder(2, 120, 20, "buy");
     console.log(orderBook.getOrderBook()); 

     /*
     {
  buyOrders: [
    Order { id: 2, side: 'buy', price: 120, quantity: 20 },
    Order { id: 3, side: 'buy', price: 80, quantity: 20 }
  ],
  sellOrders: [
    Order { id: 5, side: 'sell', price: 120, quantity: 10 },
    Order { id: 6, side: 'sell', price: 130, quantity: 15 }
  ]
    } */

     console.log(orderBook.executeOrder());
     /* 
     [
  {
    buy: Order { id: 2, side: 'buy', price: 120, quantity: 10 },
    sell: Order { id: 5, side: 'sell', price: 120, quantity: 10 }
  }
    ] */
    console.log(orderBook.getOrderBook()); 

    /*
    {
  buyOrders: [
    Order { id: 2, side: 'buy', price: 120, quantity: 10 },
    Order { id: 3, side: 'buy', price: 80, quantity: 20 }
  ],
  sellOrders: [ Order { id: 6, side: 'sell', price: 130, quantity: 15 } ]
    } */

}

Test();

