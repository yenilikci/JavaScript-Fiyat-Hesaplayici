// Storage Controller Modülü
const StorageControler = (function(){

})();

// Product Controller Modülü
const ProductController = (function(){

    //private
    const Product = function(id,name,price){
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        //ürünler dizisi içerisinde ürün objeleri tutuyor
        products: [
            {id:0,name:'Monitor',price:100},
            {id:1,name:'Ram',price:100},
            {id:2,name:'Mouse',price:100},
        ],
        //seçilen ürünü tutar
        selectedProduct:null,
        totalPrice:0  //fiyat toplamları başlangıçta sıfır
    }

    //public
    return{
        getProducts : function(){
            return data.products; //data nesnesi içerisindeki ürünleri geri döndürür
        },
        getData : function(){
            return data; //data nesnesini geri döndürür
        }
    }

})(); 

// UI Controller Modülü
const UIController = (function(){

})();

// App Modülü
const App = (function(ProductCtrl,UICtrl) //beklenen parametreler
{
    return{
        init : function(){
            console.log('uygulama başlatılıyor...');
            const products = ProductCtrl.getProducts(); //ürünleri getirdim
            UICtrl.createProductList(products); //UICtrl üzerinde oluşturulacak createProductList metodu bizden ürün bilgilerini alıp index içerisindeki ürün tablosuna yerleştirecek
        } 
    }
})(ProductController,UIController); //parametre değerleri

App.init();