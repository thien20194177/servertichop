import { Injectable, Inject } from '@nestjs/common';
import { LevenshteinDistance } from 'natural';
@Injectable()
export class CatsService {
  constructor(
    @Inject('CatsService')
    private CatsService: (a: string, b: string) => number,
  ) {}

  calculate(a: string, b: string): number {
    return this.CatsService(a, b);
  }
}
