import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./components/navbar/navbar";
import {Footer} from "./components/footer/footer";
import {Xlogo} from "./components/xlogo/xlogo";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Xlogo],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('portfolio-v2');
}
