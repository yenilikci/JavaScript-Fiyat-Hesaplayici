// Storage Controller Modülü
const StorageControler = (function () {

})();

// Product Controller Modülü
const ProductController = (function () {

    //private
    const Product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        //ürünler dizisi içerisinde ürün objeleri tutuyor (eklediğimiz bilgiler)
        products: [],
        //seçilen ürünü tutar
        selectedProduct: null,
        totalPrice: 0 //fiyat toplamları başlangıçta sıfır
    }

    //public
    return {
        getProducts: function () {
            return data.products; //data nesnesi içerisindeki ürünleri geri döndürür
        },
        getData: function () {
            return data; //data nesnesini geri döndürür
        },
        addProduct: function (name, price) {
            let id;
            if (data.products.length > 0) //eğer data objesi içerisindeki productların uzunluğu > 0 ise eleman vardır
            {
                //ürünler dizisi içerisindeki son ürünün id bilgisini alır üstüne 1 eklerim
                id = data.products[data.products.length - 1].id + 1;
            } else { //eğer eleman yoksa

                id = 0;
            }

            const newProduct = new Product(id, name, parseFloat(price)); //Product kurucusu üzerinden yeni bir obje oluşturalım id,isim ve fiyat bilgisini gönderelim
            data.products.push(newProduct); //data objesi içerisindeki ürünler dizisine yeni bir ürün nesnesi daha ekledim
            return newProduct; //eklenen ürünü geri döndürür
        },
        getTotal: function(){
            let total = 0; //toplam başlangıçta sıfır
            data.products.forEach(item => {
                total += item.price; //her elemanın fiyat bilgisini toplama ekliyoruz
            });
            data.totalPrice = total;
            return data.totalPrice; //toplamı geriye döndür
        }
    }

})();

// UI Controller Modülü
const UIController = (function () {

    const Selectors = {
        productList: "#item-list", //item-list id'li tbody etiketi seçilsin diye seçici nesnesinin bir propertysi
        addButton: '#addBtn',
        productName: '#productName',
        productPrice: '#productPrice',
        productCard: '#productCard',
        totalTL: '#total-tl',
        totalDolar: '#total-dolar'
    }

    //public
    return {
        createProductList: function (products) {
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
        getSelectors: function () {
            return Selectors; //seçicileri geri döndürüyorum
        },
        addProduct: function (prd) {
            //eğer ürün eklenecek ise ürünlerin kart varsayılan elementi blok element olmalı
            document.querySelector(Selectors.productCard).style.display = 'block';
            var item = `
            <tr>
                <td>${prd.id}</td> 
                <td>${prd.name}</td>
                <td>${prd.price} $</td>
                <td class="text-right">
                    <button type="submit" class="btn btn-primary btn-sm">
                        <i class="far fa-edit"></i>
                    </button>
                </td>
            </tr>
            `;
            //ürünü index içerisindeki tablonun içerisine de ekleyelim
            document.querySelector(Selectors.productList).innerHTML += item;
        },
        clearInputs: function () {
            //ekleme işlemi bittikten sonra inputların valuelarına boş değer atıyoruz
            document.querySelector(Selectors.productName).value = '';
            document.querySelector(Selectors.productPrice).value = '';
        },
        //ürünler kartı içerisinde ürün yoksa gizleyeceğiz
        hideCard: function () {
            document.querySelector(Selectors.productCard).style.display = 'none';
        },
        showTotal: function(total){
            //currenctlayer'ın apisi ile USD - TRY dönüşümü yaptım
                document.querySelector(Selectors.totalDolar).textContent = total;
                const api = "http://api.currencylayer.com/live?access_key=ce956947a9b5815ebe3419f952d9c909";
                fetch(api).then(res => res.json())
                .then(data => {
                    const rate = data.quotes['USDTRY'];
                    document.querySelector(Selectors.totalTL).textContent = rate*total; //TL karşılığı ile toplamı çarpıp TL toplamında gösterdim
                })
        }
    }

})();

// App Modülü
const App = (function (ProductCtrl, UICtrl) //beklenen parametreler
    {

        const UISelectors = UICtrl.getSelectors(); //Selectorları app içerisinden ulaşılabilir oldu

        //event listenerları yükle
        const loadEventListeners = function () {
            //ürün ekleme eventi
            document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit); //UISelectors üzerinden addButton'ı çağıralım ve 'click' eventi ekleyelim
        }

        //addButton'a tıklandığında çalışacak fonksiyon
        const productAddSubmit = function (e) {
            const productName = document.querySelector(UISelectors.productName).value; //ürün ismi bilgisi alındı
            const productPrice = document.querySelector(UISelectors.productPrice).value; //ürün fiyat bilgisi alındı
            //gelen bilgileri kontrol edelim
            if (productName !== '' && productPrice !== '') {
                //ürün ekleme (data'nın içerisine)
                const newProduct = ProductCtrl.addProduct(productName, productPrice); //ProductController üzerinden addProduct methodu ile isim ve fiyat bilgisi parametreleri ile ekleme yapılır bize ürün bilgisi geri döner onu da alırız
                //ürünün listeye eklenmesi (html içerisine)
                UICtrl.addProduct(newProduct);

                //toplamı getir
                const total = ProductCtrl.getTotal();

                //toplamı göster
                UICtrl.showTotal(total);

                UICtrl.clearInputs(); //ürün ekleme işlemi bittikten sonra inputları temizleyelim
            }


            e.preventDefault();
        }


        return {
            init: function () {
                console.log('uygulama başlatılıyor...');
                const products = ProductCtrl.getProducts(); //ürünleri getirdim

                if (products.length === 0) // eğer gelen ürünlerin uzunluğu === 0 ise bize gelen bir eleman yok liste boş 
                {
                    UICtrl.hideCard();
                } //listede eleman varsa
                else {
                    UICtrl.createProductList(products); //UICtrl üzerinde oluşturulan createProductList metodu bizden ürün bilgilerini alıp index içerisindeki ürün tablosuna yerleştirecek
                    //event listenerları yükle
                }
                loadEventListeners();
            }
        }
    })(ProductController, UIController); //parametre değerleri

App.init();