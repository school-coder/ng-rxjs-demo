import {Component, OnInit} from '@angular/core';
import {debounceTime, filter, iif, map, of, shareReplay, skip, switchMap, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  static readonly PERSON_URL: string = 'https://reqres.in/api/users/1';

  profileImage$ = this.http.get(AppComponent.PERSON_URL).pipe(
    map((profile: any) => profile.data.avatar),
    shareReplay()
  );

  form = new FormGroup({
    textData: new FormControl('')
  });

  constructor(private http: HttpClient) {
    this.initObservables();
  }

  private initObservables() {

    const isOdd = true;
    const odd$ = of(1, 3, 5, 7, 9, 11);
    const even$ = of(2, 4, 6, 8);

    let numberObservable = iif(() => isOdd, odd$, even$).pipe(
      filter((v) => v > 5),
      skip(1),
      map((v) => v * 10),
      tap((v) => console.log(`number: ${v}`))
    );

    let subscription = numberObservable.subscribe({
      next: () => {
      },
      error: () => {
      },
      complete: () => {
        console.log('completed');
      }
    });

    subscription.unsubscribe();

  }

  ngOnInit(): void {
    this.form.get('textData')?.valueChanges.pipe(
      debounceTime(400),
      tap((value) => console.log(value)),
      switchMap(() => this.http.get(AppComponent.PERSON_URL))
    ).subscribe();
  }
}
