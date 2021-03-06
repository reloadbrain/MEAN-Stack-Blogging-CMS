import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class MetaService {

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    // Get variable amount of posts...
    get(select: string = 'title home about contact') {

        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.get<any>(

            `${environment.apiUrl}/meta/get`,

            {

                headers: headers,

                params: new HttpParams().set('select', select)

            }

        );

    }

    update(meta: object) {

        let token = this.authService.getToken();

        let headers = new HttpHeaders({

            'Content-Type': 'application/json',

            'Authorization': token

        });

        return this.http.post(

            `${environment.apiUrl}/meta/update`,

            { meta: meta },

            { headers: headers }

        );

    }

}