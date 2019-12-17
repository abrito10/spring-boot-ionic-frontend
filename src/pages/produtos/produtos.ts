import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoService } from '../../services/domain/produto.service';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})

export class ProdutosPage {

  items : ProdutoDTO[] = [];
  page : number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public produtoService : ProdutoService,
    public loadingCtrl: LoadingController
    ) {
  }

  ionViewDidLoad() {
    this.loadData();
    
  }
   
  loadData(){

    let categoria_id = this.navParams.get('categoria_id');
    let loader = this.presentLoading();

     this.produtoService.findByCategoria(categoria_id, this.page, 10)
        .subscribe(response => {
        let inicio = this.items.length;
        this.items = this.items.concat(response['content']);
        let fim = this.items.length - 1;
        loader.dismiss();

      this.loadImageUrls(inicio,fim);
      },
    error => {
      loader.dismiss();
    });

  }
  loadImageUrls(inicio: number, fim: number) {
    for (var i=inicio; i<=fim; i++) {
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
        },
        error => {});
    }
  }  
  showDetail(produto_id : string) {
    this.navCtrl.push('ProdutoDetailPage', {produto_id : produto_id});
  }


  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

  doRefresh(refresher) {
    this.page = 0;
    this.items = [];
    
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }


  doInfinite(infiniteScroll) {
    this.page++;
    this.loadData();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }

}
