import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Component({
	moduleId: module.id,
	selector: 'app',
	templateUrl: 'template/app.component.html',
	styleUrls: ['template/css/app.component.css'],
})

export class AppComponent {
	title: string = 'Url shortener'
	newUrl: string = '';
	desireUrl: string = '';
	path: string = '';
	
	error: boolean = false;
	loading: boolean = false;

	text: string = '';
	errorText: string = '';
	shortUrl: string = '';
	constructor(private http: Http) {
		this.path = window.location.href;
	 }
	
	change(value: string) {
		if (value != null || undefined) {
			this.text = 'Your future url: ';
			this.error = false;
			this.shortUrl = value;
		}
	}

	onSubmit() {
		this.loading = true;
		const data = JSON.stringify({
			url: this.newUrl,
			desireUrl: this.desireUrl
		})

		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
		this.http.post(this.path + 'api/getShortUrl', data, {headers: headers})
			.subscribe(
			(data: any) => { 
				const response = JSON.parse(data._body)
				if (response.error) {
					this.errorText = 'Error: ' + response.error
					this.error = true;
					this.loading = false;
				} else if (response.url) {
					this.error = false;
					this.shortUrl = response.url;
					this.text = 'Your short url is: ';
					this.loading = false;
				} 
			},
			(err: any) => this.loading = false); 
		
		this.newUrl = '';
		this.desireUrl = '';
	}
}