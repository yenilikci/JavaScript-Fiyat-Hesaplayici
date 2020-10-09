// Storage Controller Modülü
const StorageControler = (function () {

    return {
        //ürünün local storage'a kaydedilmesi
        storeProduct: function (product) {
            let products;
            //eğer storage içerisinde daha önce products isimli bir alan oluşturulmamış ise
            if (localStorage.getItem('products') === null) {
                products = []; //ürünler listesinin oluşturalım
                products.push(product); //gelen ürün objesini bu ürünler listesine ekleyelim
            } else { //products isimli daha önce tanımlanmış bir alan var 
                products = JSON.parse(localStorage.getItem('products')); //stringi json objesine çevirelim (parse ile)
                products.push(product); //ki push methodu ile üzerine yeni ürün bilgisini ekleyebilelim
            }
            localStorage.setItem('products', JSON.stringify(products)); //ürünler listesini local storage'a products anahtarı ile string bir ifadeye çevirerek kaydediyoruz
        },
        //ürün bilgilerinin local storage'dan getirilmesi
        getProducts: function () {
            let products;
            if (localStorage.getItem('products') == null) {
                //eğer local storage'da products isimli tanımlı bir alan yoksa
                products = [];
            } else { //eğer bir bilgi varsa
                products = JSON.parse(localStorage.getItem('products')); //products alanından bilgileri getir
            }

            return products; //okunan ürün listesini geri döndür (products isimli tanımlı alandaki)
        },
        //ürün bilgilerini local storage'da güncelle
        updateProduct: function (product) {
            let products = JSON.parse(localStorage.getItem('products'));
            //aradığımız ürün ile ürünler listesindeki ürün eşleşirse
            products.forEach(function (prd, index) {
                if (prd.id === product.id) {
                    products.splice(index, 1, product); //indexten itibaren bir elemanı siler yerine gönderdiğimiz ürünü ekler
                }
            });
            localStorage.setItem('products', JSON.stringify(products)); //güncellenmiş hali ile tekrar local storage'a kaydediyoruz
        },
        deleteProduct: function(id){
            let products = JSON.parse(localStorage.getItem('products'));
            //aradığımız ürün ile ürünler listesindeki ürün eşleşirse
            products.forEach(function (prd, index) {
                if (prd.id === id) {
                    products.splice(index, 1); 
                }
            });
            localStorage.setItem('products', JSON.stringify(products)); //güncellenmiş hali ile tekrar local storage'a kaydediyoruz
        }
    }

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
        //local storage'da products alanının içerisindeki ürün objelerini tutuyor (eklediğimiz bilgiler)
        products: StorageControler.getProducts(),
        //seçilen ürünü tutar
        selectedProduct: null,
        totalPrice: 0 //fiyat toplamları başlangıçta sıfır
    }

    //public
    return {
        getProducts: function () {
            return data.products; //data nesnesi içerisindeki ürünleri geri döndürür
        },
        "getData": function () {
            return data; //data nesnesini geri döndürür yani tüm ürünleri,seçilen ürünü,toplam tutarı
        },
        getProductById: function (id) { //gelen id bilgisine göre ürün getirecek
            let product = null;

            data.products.forEach(prd => {
                if (prd.id == id) //eğer ürünler listesindeki bir ürünün id'si parametre olarak gelen id'ye eşit ise
                {
                    product = prd; //o ürünü product değişkenine atayalım
                }
            });
            return product; //en son ürünü geri döndürelim
        },
        setCurrentProduct: function (product) {
            data.selectedProduct = product; //data içerisindeki seçilen ürüne, seçtiğimiz ürünü aktaralım

        },
        getCurrentProduct: function () {
            //o anda seçili olan ürünün bilgisi için
            return data.selectedProduct;
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
        updateProduct: function (name, price) {
            let product = null;

            data.products.forEach(function (prd) {
                //ürünler listesindeki id , seçilen ürünün id'si ile eşleşirse
                if (prd.id == data.selectedProduct.id) {

                    //ürünün isim ve fiyat değerlerini parametreden gelen değerler olarak ata
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd; //yeni elemanı ata
                }
            });

            return product; //güncellenmiş ürünü geri döndür
        },
        deleteProduct: function (product) { //ürünü parametre olarak alıyor, ürünü silecek

            data.products.forEach(function (prd, index) {

                //ürünler listesinde dolaşacağım her ürün ile parametre olarak gönderdiğim ürünün id'si eşleşiyor mu
                if (prd.id === product.id) {
                    data.products.splice(index, 1); //eşleştiği an gösterilen index değerinden itibaren bir elemanı silerim
                }

            })

        },
        getTotal: function () {
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
        productListItems: "#item-list tr", //item-list altındaki bütün tr etiketleri
        addButton: '#addBtn',
        updateButton: '#updateBtn',
        cancelButton: '#cancelBtn',
        deleteButton: '#deleteBtn',
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
                            <i class="far fa-edit edit-product"></i>
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
                        <i class="far fa-edit edit-product"></i>
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
        clearWarnings: function () {
            let items = document.querySelectorAll(Selectors.productListItems);
            //seçilen tr elemanlarını gez eğer bg-warning sınıfına sahipse
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.classList.remove('bg-warning'); //bg-warning sınıfını sil
                }
            });
        },
        //ürünler kartı içerisinde ürün yoksa gizleyeceğiz
        hideCard: function () {
            document.querySelector(Selectors.productCard).style.display = 'none';
        },
        showTotal: function (total) {
            //currenctlayer'ın apisi ile USD - TRY dönüşümü yaptım
            document.querySelector(Selectors.totalDolar).textContent = total;
            const api = "http://api.currencylayer.com/live?access_key=ce956947a9b5815ebe3419f952d9c909";
            fetch(api).then(res => res.json()) //fetch api kullanıyorum
                .then(data => {
                    const rate = data.quotes['USDTRY'];
                    document.querySelector(Selectors.totalTL).textContent = rate * total; //TL karşılığı ile toplamı çarpıp TL toplamında gösterdim
                })
        },
        addProductToForm: function () {
            const selectedProduct = ProductController.getCurrentProduct(); //Seçilen ürün bilgisini aldık
            document.querySelector(Selectors.productName).value = selectedProduct.name; //ürün isminin geldiği inputa seçili ürün ismini yerleştirdik
            document.querySelector(Selectors.productPrice).value = selectedProduct.price; //ürün fiyatının geldiği inputa seçili ürün fiyatını yerleştirdik

        },
        updateProduct: function (prd) { //UI'da düzenlenen ürünün gösterilmesi
            let updatedItem = null;

            let items = document.querySelectorAll(Selectors.productListItems); //tr etiketlerini seçtik
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    //isim td'si
                    item.children[1].textContent = prd.name;
                    //fiyat td'si   
                    item.children[2].textContent = prd.price + ' $';
                    updatedItem = item;
                }
            });

            return updatedItem;
        },
        deleteProduct: function () { //UI'dan ürünün silinmesi
            let items = document.querySelectorAll(Selectors.productListItems);
            //bütün elemanları aldım bu liste üzerinde elemanları tek tek dolaşalım
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.remove(); //eğer elemanın sınıfı içerisinde bg-warning varsa (yani seçilen elemansa) silme işleminde bu ürün silinsin
                }
            });
        },
        addingState: function (item) {
            //eğer bize gelecek item null değil ise yani bir parametre, bir nesne varsa arkplan rengini sil
            UIController.clearWarnings();
            //ekleme durumu
            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display = 'inline'; //ekleme butonu görünür halde
            //diğer butonlar gizlendi
            document.querySelector(Selectors.updateButton).style.display = 'none';
            document.querySelector(Selectors.deleteButton).style.display = 'none';
            document.querySelector(Selectors.cancelButton).style.display = 'none';
        },
        editState: function (tr) {
            //seçmiş olduğum elemanı içeren tr elemanı
            tr.classList.add('bg-warning');
            //düzenleme durumu
            document.querySelector(Selectors.addButton).style.display = 'none'; //ekleme butonu gizlenmiş halde
            //diğer butonlar ise görünür halde
            document.querySelector(Selectors.updateButton).style.display = 'inline';
            document.querySelector(Selectors.deleteButton).style.display = 'inline';
            document.querySelector(Selectors.cancelButton).style.display = 'inline';

        }
    }

})();

// App Modülü
const App = (function (ProductCtrl, UICtrl, StorageCtrl) //beklenen parametreler
    {

        const UISelectors = UICtrl.getSelectors(); //Selectorları app içerisinden ulaşılabilir oldu

        //event listenerları yükle
        const loadEventListeners = function () {
            //ürün ekleme eventi
            document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit); //UISelectors üzerinden addButton'ı seçelim ve 'click' eventi ekleyelim

            //ürünü düzenle tıklaması
            document.querySelector(UISelectors.productList).addEventListener('click', productEditClick); //UISelectors üzerinden productList'i seçelim ve 'click' eventi ekleyelim

            //ürün düzenlemeyi kaydet
            document.querySelector(UISelectors.updateButton).addEventListener('click', editProductSubmit); //UISelector üzerinden updatButton'ı seçelim ve 'click eventi ekleyelim

            //ürün düzenleme iptal
            document.querySelector(UISelectors.cancelButton).addEventListener('click', cancelUpdate);

            //ürün silme işlemi
            document.querySelector(UISelectors.deleteButton).addEventListener('click', deleteProductSubmit);
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

                //ürün ekleme işlemi bittikten sonra local storage'a ekleyelim
                StorageCtrl.storeProduct(newProduct);

                //toplamı getir
                const total = ProductCtrl.getTotal();

                //toplamı göster
                UICtrl.showTotal(total);

                UICtrl.clearInputs(); //ürün ekleme işlemi bittikten sonra inputları temizleyelim
            }


            e.preventDefault();
        }

        //productList'e tıklandığında çalışacak fonksiyon
        const productEditClick = function (e) {

            //eğer gelen event parametresinin target özelliğinin classList'i içerisinde edit-product elemanı varsa
            if (e.target.classList.contains('edit-product')) {
                //artık ikona tıklandığında işlemlerim gerçekleşecek
                const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent; //ürünün id bilgisini aldık

                const product = ProductCtrl.getProductById(id); //göndereceğimiz id bilgisi ile ürün bilgisini getirsin

                //seçilen ürünü düzenle
                ProductCtrl.setCurrentProduct(product);

                //Eski seçilen ürünlerin arkaplanlarını da silelim
                UIController.clearWarnings();

                //UI'da Ürün Ekleme Özelliği
                UICtrl.addProductToForm();

                //ürün düzenlemeye geçildiğinde durum düzenleme durumuna geçsin
                UICtrl.editState(e.target.parentNode.parentNode); //böylece tr elemanına ulaştım


            }
            e.preventDefault(); //submit olayını durduralım
        }

        //updateButton'a tıklandığında çalışacak fonksiyon
        const editProductSubmit = function (e) {

            const productName = document.querySelector(UISelectors.productName).value; //ürün ismi bilgisi alındı
            const productPrice = document.querySelector(UISelectors.productPrice).value; //ürün fiyat bilgisi alındı

            if (productName !== '' && productPrice !== '') {
                //Ürünü güncelle onun bilgisini de updatedProduct'da tut
                const updatedProduct = ProductCtrl.updateProduct(productName, productPrice);

                //UI'ı güncelle
                let item = UICtrl.updateProduct(updatedProduct);

                //toplamı getir
                const total = ProductCtrl.getTotal();

                //toplamı göster
                UICtrl.showTotal(total);

                //local storage'ı güncelle
                StorageCtrl.updateProduct(updatedProduct);

                UICtrl.addingState();
            }
            e.preventDefault();

        }

        const cancelUpdate = function (e) {

            //kullanıcıyı ekleme durumuna geri gönder
            UIController.addingState();
            //seçili arkaplanı siler
            UIController.clearWarnings();

            e.preventDefault();
        }

        const deleteProductSubmit = function (e) {
            //seçilen ürünü getir
            const selectedProduct = ProductCtrl.getCurrentProduct();

            //ürünü sil (ürünler listesinden veri olarak)
            ProductCtrl.deleteProduct(selectedProduct);

            //ürünü kullanıcı arayüzünden sil
            UICtrl.deleteProduct();

            //toplamı getir
            const total = ProductCtrl.getTotal();

            //toplamı göster
            UICtrl.showTotal(total);

            //local storage'den ürünü silmek
            StorageCtrl.deleteProduct(selectedProduct.id);

            //ekleme durumuna geri döndür
            UICtrl.addingState();

            if (total == 0) //toplam miktar sıfırsa
            {
                UICtrl.hideCard(); //ürün tablosunun olduğu card nesnesini gizle
            }

            e.preventDefault();
        }

        return {
            init: function () {
                console.log('uygulama başlatılıyor...');

                UICtrl.addingState(); //uygulama başlatıldığında ekleme durumunda başlatılsın

                const products = ProductCtrl.getProducts(); //ürünleri getirdim

                if (products.length === 0) // eğer gelen ürünlerin uzunluğu === 0 ise bize gelen bir eleman yok liste boş 
                {
                    UICtrl.hideCard();
                } //listede eleman varsa
                else {
                    UICtrl.createProductList(products); //UICtrl üzerinde oluşturulan createProductList metodu bizden ürün bilgilerini alıp index içerisindeki ürün tablosuna yerleştirecek
                    //event listenerları yükle
                }
                //toplamı getir
                const total = ProductCtrl.getTotal();

                //toplamı göster
                UICtrl.showTotal(total);
                loadEventListeners();
            }
        }
    })(ProductController, UIController, StorageControler); //parametre değerleri, gerçek objeyi göndereceğiz

App.init();