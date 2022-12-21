import {Component} from '@angular/core';
import {catchError, forkJoin, of, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-fork-join',
  templateUrl: './fork-join.component.html',
  styleUrls: ['./fork-join.component.css']
})
export class ForkJoinComponent {


  private startDate: Date = new Date();
  private endDate: Date = new Date();
  private chartData: any;

  constructor(private http: HttpClient) {
    this.subcribe();
  }


  private subcribe() {

    const dateRange$ = of([new Date(), new Date()]);
    const user$ = of({ name: 'Nagarajan', company: 'Software AG'});
    const image$ = this.http.get('http://httpbin.org/image/png');
    const language$ = of('English');

    forkJoin( [
      this.http.get<string>('some/api/welcomeMessage'),
      language$,
      dateRange$.pipe(
        tap(([start, end]) => {
          this.startDate = start;
          this.endDate = end;
        }),
        catchError(() => of([new Date(), new Date()]))
      ),
      user$.pipe(tap((user) => {
        this.setUsers(user)
      })),

      image$.pipe(
        tap((data) => {
          this.chartData = data
        })
      )
      ]
    )
      .subscribe(([message, language]) => {
        this.setWelcomeMessage(message, language);
        // all data aquired, wire-up everything
        this.launch();
      }, () => {

      });
  }

  private launch() {

  }

  private setUsers(users: unknown) {

  }

  private setWelcomeMessage(resultElement: string, lanugage: string) {
    //TODO: Set Welcome Message
  }
}
