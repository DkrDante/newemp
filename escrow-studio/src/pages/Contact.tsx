
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast'; // Optional toast hook

type ChatEntry = {
  text: string;
  sender: 'user' | 'bot';
  feedbackGiven?: boolean;
};

const botReplies = (input: string): string => {
  const lower = input.toLowerCase();

  if (lower.includes('freelancer')) {
    return 'Freelancers on our platform are verified and skilled. You can view their profile and reviews before hiring.';
  } else if (lower.includes('how') && lower.includes('hire')) {
    return 'To hire a freelancer, go to their profile and click "Hire Now" or send them a message.';
  } else if (lower.includes('payment')) {
    return 'All payments are processed securely through our platform. You pay only when the work is done.';
  } else if (lower.includes('contact') || lower.includes('support')) {
    return 'You can reach support by typing your issue here or emailing us at support@example.com.';
  } else if (lower.includes('hello') || lower.includes('hi')) {
    return 'Hey there! 👋 How can I help you today?';
  } else {
    return "Hmm... I'm not sure about that. Could you rephrase or ask something else?";
  }
};

const ChatMessage = ({
  message,
  sender,
  feedbackGiven,
  onFeedback,
}: {
  message: string;
  sender: 'user' | 'bot';
  feedbackGiven?: boolean;
  onFeedback?: (type: 'up' | 'down') => void;
}) => (
  <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
    <div
      className={`px-4 py-2 rounded-2xl max-w-xs ${
        sender === 'user'
          ? 'bg-primary text-white rounded-br-none'
          : 'bg-muted text-foreground rounded-bl-none'
      }`}
    >
      <div>{message}</div>
      {sender === 'bot' && onFeedback && !feedbackGiven && (
        <div className="flex justify-end gap-2 mt-2 text-muted-foreground text-sm">
          <button onClick={() => onFeedback('up')} aria-label="Thumbs up">
            <ThumbsUp size={16} />
          </button>
          <button onClick={() => onFeedback('down')} aria-label="Thumbs down">
            <ThumbsDown size={16} />
          </button>
        </div>
      )}
      {feedbackGiven && (
        <div className="text-xs text-right mt-2 text-green-500">Thanks for the feedback!</div>
      )}
    </div>
  </div>
);

const Contact = () => {
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      text: 'Hi! I’m your freelance assistant bot. Ask me anything about the site or freelancers.',
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatEntry = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const reply = botReplies(input);
      const botMsg: ChatEntry = { text: reply, sender: 'bot', feedbackGiven: false };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);

    setInput('');
  };

  const handleFeedback = (index: number, type: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, feedbackGiven: true } : msg
      )
    );

    toast({
      title: 'Thanks!',
      description: type === 'up'
        ? 'Glad that helped! 👍'
        : 'Noted. We’ll try to do better. 👀',
    });

    console.log(`Feedback on message #${index}: ${type}`);
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container px-4 mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Chat with Support Bot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-96 overflow-y-auto p-2 border rounded-md bg-muted">
              {messages.map((msg, idx) => (
                <ChatMessage
                  key={idx}
                  message={msg.text}
                  sender={msg.sender}
                  feedbackGiven={msg.feedbackGiven}
                  onFeedback={
                    msg.sender === 'bot' && !msg.feedbackGiven
                      ? (type) => handleFeedback(idx, type)
                      : undefined
                  }
                />
              ))}
              {isTyping && (
                <div className="text-muted-foreground text-sm italic">Bot is typing...</div>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something like 'How do I hire a freelancer?'"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={handleSend}>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;

