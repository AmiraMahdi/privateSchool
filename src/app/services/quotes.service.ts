import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  quotesUrl: string = "http://localhost:3000/quotes";

  constructor(private httpClient: HttpClient) { }
  getQuote(){
    return this.httpClient.get<{quote:any}>(this.quotesUrl)

  }
}
