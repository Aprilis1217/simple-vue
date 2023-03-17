import SimpleVue from "./../src/index.js";
console.log(SimpleVue, 'SimpleVue')
new SimpleVue({
  el: '#app',
  data: {
    user: {
      name: '阿柳',
      age: 18,
      city: '武汉'
    },
    count: 0
  },
  mounted() {
    setInterval(() => {
      this.count++;
    }, 3000);
  }
})