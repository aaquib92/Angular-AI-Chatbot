import { Component } from '@angular/core';
import { ChatService } from '../services/chat.service';  // Import the Gemini service
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-chat',
  imports: [CommonModule,FormsModule,MatFormFieldModule,MatInputModule,MatCardModule,MatButtonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
 messages:any[]=[]
  userInput:any;

    constructor(private chatService: ChatService) {}

getColor(index: number): string {
  const colors = ['#e3f2fd', '#fce4ec'];
  return colors[index % colors.length];
}
  async sendMessage() {
  this.messages.push(`You: ${this.userInput}`);
  const reply = await this.chatService.getGeminiResponse(this.userInput);
  this.messages.push(`AI: ${reply}`);
  this.userInput = '';
}
}