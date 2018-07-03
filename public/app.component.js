"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var AppComponent = /** @class */ (function () {
    function AppComponent(http) {
        this.http = http;
        this.title = 'Url shortener';
        this.newUrl = '';
        this.desireUrl = '';
        this.path = '';
        this.error = false;
        this.loading = false;
        this.text = '';
        this.errorText = '';
        this.shortUrl = '';
        this.path = window.location.href;
    }
    AppComponent.prototype.change = function (value) {
        if (value != null || undefined) {
            this.text = 'Your future url: ';
            this.error = false;
            this.shortUrl = value;
        }
    };
    AppComponent.prototype.onSubmit = function () {
        var _this = this;
        this.loading = true;
        var data = JSON.stringify({
            url: this.newUrl,
            desireUrl: this.desireUrl
        });
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post(this.path + 'api/getShortUrl', data, { headers: headers })
            .subscribe(function (data) {
            var response = JSON.parse(data._body);
            if (response.error) {
                _this.errorText = 'Error: ' + response.error;
                _this.error = true;
                _this.loading = false;
            }
            else if (response.url) {
                _this.error = false;
                _this.shortUrl = response.url;
                _this.text = 'Your short url is: ';
                _this.loading = false;
            }
        }, function (err) { return _this.loading = false; });
        this.newUrl = '';
        this.desireUrl = '';
    };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app',
            templateUrl: 'template/app.component.html',
            styleUrls: ['template/css/app.component.css'],
        }),
        __metadata("design:paramtypes", [http_1.Http])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map