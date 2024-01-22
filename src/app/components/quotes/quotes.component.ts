import { Component, OnInit } from '@angular/core';
import { QuotesService } from 'src/app/services/quotes.service';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {
  quote: any = {};
  constructor(private quotesService: QuotesService) { }

  ngOnInit() {
    this.quotesService.getQuote().subscribe(
      (data) => {
        this.quote = data.quote
      }
    )
  }

}
