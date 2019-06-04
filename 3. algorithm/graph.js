// let graph = new Graph();
// graph.addNode("node1");
// graph.addNode("node2");
// graph.addNode("node3");
// graph.addDirectedEdge("node1", "node2", 5);
// graph.addDirectedEdge("node2", "node3", 3);
// graph.addDirectedEdge("node3", "node2", 1);
// graph.addDirectedEdge("node1", "node3", 1);
// graph.display();
// graph.floydWarshallAlgorithm_chestnoStyreno("node1", "node2");

class Graph {
   constructor() {
      this.edges = {};
      this.nodes = [];
   }

   hasNode(node) {
      return this.nodes.indexOf(node) > -1;
   }

   addNode(node) {
      if (!this.hasNode(node)) {
         this.nodes.push(node);
         this.edges[node] = [];
      }
   }

   removeNode(node) {
      let index = this.nodes.indexOf(node);
      if (index > -1) {
         this.nodes.splice(index, 1);
         delete this.edges[node];
         for (let elem in this.edges) {
            let elements = this.edges[elem].filter(edge => edge.node != node);
            this.edges[elem] = elements;
         }
      }
   }

   hasDirectedEdge(node1, node2) {
      return this.edges[node1] && this.edges[node1].findIndex(elem => elem.node == node2) > -1;
   }

   addDirectedEdge(node1, node2, weight = 1) {
      if (this.hasNode(node1) && this.hasNode(node2) && !this.hasDirectedEdge(node1, node2)) {
         this.edges[node1].push({ node: node2, weight: weight });
      }
   }

   removeDirectedEdge(node1, node2) {
      if (this.hasNode(node1) && this.hasNode(node2)) {
         let index = this.edges[node1].findIndex(elem => elem.node == node2);
         if (index > -1) {
            this.edges[node1].splice(index, 1);
         }
      }
   }

   getNeighbours(node) {
      let neighbours = [];
      for (let elem in this.edges) {
         if (elem != node) {
            this.edges[elem].forEach(edge => {
               if (edge.node == node) {
                  if (!neighbours.includes(elem)) {
                     neighbours.push(elem);
                  }
               }
            });
         }
      }
      this.edges[node].forEach(edge => {
         if (!neighbours.includes(edge.node)) {
            neighbours.push(edge.node);
         }
      });
      return neighbours;
   }

   getEdgeWeight(node1, node2) {
      let edge = this.edges[node1].find(elem => elem.node == node2);
      if (edge) {
         return edge.weight;
      }
   }

   turnOpposite() {
      let graph = new Graph();
      for (let elem in this.edges) {
         graph.addNode(elem);
         this.edges[elem].forEach(edge => {
            graph.addNode(edge.node);
            graph.addDirectedEdge(edge.node, elem);
         });
      }
      return graph;
   }

   getMatrix() {
      let matrix = [];
      for (let i = 0; i < this.nodes.length; i++) {
         matrix[i] = [];
         for (let j = 0; j < this.nodes.length; j++) {
            matrix[i][j] = this.hasDirectedEdge(this.nodes[i], this.nodes[j]) ? 1 : 0;
         }
      }
      return matrix;
   }

   getSubgraph() {
      let graph = new Graph();
      for (let i = 0; i < arguments.length; i++) {
         if (this.hasNode(arguments[i])) {
            graph.addNode(arguments[i]);
            for (let j = 0; j < arguments.length; j++) {
               if (i != j && this.hasNode(arguments[j]) && this.hasDirectedEdge(arguments[i], arguments[j])) {
                  graph.addNode(arguments[j]);
                  graph.addDirectedEdge(arguments[i], arguments[j]);
               }
            }
         }
      }
      return graph;
   }

   display() {
      let graph = "";
      this.nodes.forEach(node => {
         graph += node + " -> " + this.edges[node].map(n => n.node + " (" + n.weight + ")").join(", ") + "\n";
      });
      console.log(graph);
   }

   floydWarshallAlgorithm_chestnoStyreno(node1, node2) {
      if (!this.hasNode(node1) || !this.hasNode(node2)) {
         return Infinity;
      }
      let dist = {};
      for (let i = 0; i < this.nodes.length; i++) {
         dist[this.nodes[i]] = {};

         // For existing edges assign the dist to be same as weight
         this.edges[this.nodes[i]].forEach(e => (dist[this.nodes[i]][e.node] = e.weight));

         this.nodes.forEach(n => {
            // For all other nodes assign it to infinity
            if (dist[this.nodes[i]][n] == undefined)
               dist[this.nodes[i]][n] = Infinity;
            // For self edge assign dist to be 0
            if (this.nodes[i] === n) dist[this.nodes[i]][n] = 0;
         });
      }

      this.nodes.forEach(i => {
         this.nodes.forEach(j => {
            this.nodes.forEach(k => {
               // Check if going from i to k then from k to j is better
               // than directly going from i to j. If yes then update
               // i to j value to the new value
               if (dist[i][k] + dist[k][j] < dist[i][j])
                  dist[i][j] = dist[i][k] + dist[k][j];
            });
         });
      });
      return dist[node1][node2];
   }
}