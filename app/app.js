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

    const Selectors = {
        productList : "#item-list" //item-list id'li tbody etiketi seçilsin diye seçici nesnesinin bir propertysi
    }

    //public
    return{
        createProductList : function(products){
            let html = '';

            //ürünler dizisindeki her bir ürünü , html içerisindeki ürünler tablosuna ekleyelim
            products.forEach(prd => {
                html += `
                <tr>
                    <td>${prd.id}</td> 
                    <td>${prd.name}</td>
                    <td>${prd.price} $</td>
                    <td class="text-right">
                        <button type="submit" class="btn btn-primary btn-sm">
                            <i class="far fa-edit"></i>
                        </button>
                    </td>
                </tr>`
            });

            document.querySelector(Selectors.productList).innerHTML = html; //html bilgilerini item-list id'li tbody'ye aktaracağız
        },
        getSelectors : function(){
            return Selectors;
        }
    }

})();

// App Modülü
const App = (function(ProductCtrl,UICtrl) //beklenen parametreler
{
    return{
        init : function(){
            console.log('uygulama başlatılıyor...');
            const products = ProductCtrl.getProducts(); //ürünleri getirdim
            UICtrl.createProductList(products); //UICtrl üzerinde oluşturulan createProductList metodu bizden ürün bilgilerini alıp index içerisindeki ürün tablosuna yerleştirecek
        } 
    }
})(ProductController,UIController); //parametre değerleri

App.init();