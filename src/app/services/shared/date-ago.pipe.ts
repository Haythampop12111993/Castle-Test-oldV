import { ChangeDetectorRef, NgZone, Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "dateAgo",
  pure: false,
})
export class DateAgoPipe implements PipeTransform {
  private currentTimer: number | null;

  constructor(private cdRef: ChangeDetectorRef, private ngZone: NgZone) {}

  transform(value: string): any {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 29) return "Just now";
      const intervals: { [key: string]: number } = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
      };
      let counter;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0) return `${counter} ${i}${counter > 1 ? "s" : ""}`;
      }
      this.removeTimer();
    }
    this.createTimer();
    return value;
  }

  ngOnDestroy(): void {
    this.removeTimer();
  }

  private createTimer() {
    if (this.currentTimer) {
      return;
    }

    this.currentTimer = this.ngZone.runOutsideAngular(() => {
      if (typeof window !== "undefined") {
        return window.setTimeout(() => {
          this.currentTimer = null;
          this.ngZone.run(() => this.cdRef.markForCheck());
        }, 30000);
      } else {
        return null;
      }
    });
  }
  private removeTimer() {
    if (this.currentTimer) {
      window.clearTimeout(this.currentTimer);
      this.currentTimer = null;
    }
  }
}
