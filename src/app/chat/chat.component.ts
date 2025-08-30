import { Component,NgZone } from '@angular/core';
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
  isListening: boolean = false;

    constructor(private chatService: ChatService,private ngZone: NgZone) {}

getColor(index: number): string {
  const colors = ['#e3f2fd', '#fce4ec'];
  return colors[index % colors.length];
}
// Send message to AI
  async sendMessage() {
  this.messages.push(`You: ${this.userInput}`);
  const reply = await this.chatService.getGeminiResponse(this.userInput);
  this.messages.push(`AI: ${reply}`);
  this.userInput = '';
}

// voice message 
 async sendToGemini(prompt: string): Promise<void> {
    const model = this.chatService.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    console.log("prompt",prompt);
    console.log("response",response);
    this.ngZone.run(() => {
    this.messages.push(`You: ${prompt}`);
    this.messages.push(`Gemini: ${response}`);
    this.speak(response);
  });


  
    this.speak(response); // Optional: read response aloud
  }


  speak(text: string): void {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
}

startListening(): void {

  const recognition = new (window as any).webkitSpeechRecognition();
  if (!recognition) {
    alert('Speech recognition not supported in this browser.');
    return;
  }
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    console.log(transcript);
     // 👇 Push transcript immediately to messages array
    this.sendToGemini(transcript);
  };

   recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
    alert(`Speech recognition error: ${event.error}`);
  };

   recognition.onstart = () => {
    this.ngZone.run(() => {
      this.isListening = true;
    });
  };

  recognition.onend = () => {
    this.ngZone.run(() => {
      this.isListening = false;
    });
      console.log('Speech recognition ended.');
  };

  recognition.start();
}

// clear message
clearMessage(){
  this.messages =[];
}

}