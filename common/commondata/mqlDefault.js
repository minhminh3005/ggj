export default `extern double TakeProfit    =50;
extern double Lots          =0.1;
extern double TrailingStop  =30;
extern double MACDOpenLevel =3;
extern double MACDCloseLevel=2;
extern int    MATrendPeriod =26;

string ProgramName = "Sample";

int init()
{
   Print(StringTrimLeft(StringTrimRight(ProgramName)));

   int period = Period();
   if(!IsTradeAllowed()) {
       return(-1);
   }

    Comment(
        iCustom(Symbol(), 0, "Examples\\Custom Moving Average", 0, 1),
        iCustom(Symbol(), 0, "Examples\\MACD", 12, 26, 9, PRICE_CLOSE, MODE_SIGNAL, 0, 1)
    );

   return(0);
}

int deinit() {
   return(0);
}

int start()
{
   double MacdCurrent,MacdPrevious;
   double SignalCurrent,SignalPrevious;
   double MaCurrent,MaPrevious;
   int    cnt,ticket,total;

   if(Bars < 100) {
      Print("bars less than 100");
      return(0);
   }
   if(TakeProfit < 10) {
      Print("TakeProfit less than 10");
      return ( 0 ) ;
   }

   MacdCurrent = iMACD(NULL,0,12,26,9,PRICE_CLOSE,MODE_MAIN,0);
   MacdPrevious = iMACD(NULL,0,12,26,9,PRICE_CLOSE,MODE_MAIN,1);
   SignalCurrent = iMACD(NULL,0,12,26,9,PRICE_CLOSE,MODE_SIGNAL,0);
   SignalPrevious = iMACD(NULL,0,12,26,9,PRICE_CLOSE,MODE_SIGNAL,1);
   MaCurrent = iMA(NULL,0,MATrendPeriod,0,MODE_EMA,PRICE_CLOSE,0);
   MaPrevious = iMA(NULL,0,MATrendPeriod,0,MODE_EMA,PRICE_CLOSE,1);

   total = OrdersTotal();

   if(total < 1) {
      if(AccountFreeMargin()<(1000*Lots)) {
         Print("We have no money. Free Margin = ",AccountFreeMargin());
         return(0);
      }

      if(MacdCurrent<0 && MacdCurrent>SignalCurrent && MacdPrevious<SignalPrevious && MathAbs(MacdCurrent)>(MACDOpenLevel*Point) && MaCurrent>MaPrevious) {
         ticket = OrderSend(Symbol(),OP_BUY,Lots,Ask,3,0,Ask+TakeProfit*Point,"macd sample",16384,0,Green);
         if(ticket > 0) {
            if(OrderSelect(ticket,SELECT_BY_TICKET,MODE_TRADES)) {
               Print("BUY order opened : ",OrderOpenPrice());
            }
         } else {
            Print("Error opening BUY order : ",GetLastError());
         }
         return (0);
      }

      if(MacdCurrent > 0 && MacdCurrent < SignalCurrent && MacdPrevious > SignalPrevious && MacdCurrent > (MACDOpenLevel*Point) && MaCurrent < MaPrevious) {
         ticket = OrderSend(Symbol(),OP_SELL,Lots,Bid,3,0,Bid-TakeProfit*Point,"macd sample",16384,0,Red);
         if(ticket>0) {
            if(OrderSelect(ticket,SELECT_BY_TICKET,MODE_TRADES)) {
               Print("SELL order opened : ",OrderOpenPrice());
            }
         } else {
            Print("Error opening SELL order : ",GetLastError());
         }
      }
      return ( 0);
   }

   for(cnt = 0; cnt < total; cnt++) {
      if(!OrderSelect(cnt,SELECT_BY_POS,MODE_TRADES)) {
         continue;
      }
      if(OrderType() <= OP_SELL && OrderSymbol() == Symbol()) {
         if(OrderType() == OP_BUY) {
            if(MacdCurrent > 0 && MacdCurrent<SignalCurrent && MacdPrevious>SignalPrevious && MacdCurrent > (MACDCloseLevel*Point)) {
               if(!OrderClose(OrderTicket(),OrderLots(),Bid,3,Violet)) {
                  Print("OrderClose error ",GetLastError());
               }
               return(0) ;
            }
            if(TrailingStop > 0) {
               if(Bid-OrderOpenPrice()>Point*TrailingStop) {
                  if(OrderStopLoss()<Bid-Point*TrailingStop) {
                     if(!OrderModify(OrderTicket(),OrderOpenPrice(),Bid-Point*TrailingStop,OrderTakeProfit(),0,Green)) {
                        Print("OrderModify error ",GetLastError());
                     }
                     return(0);
                  }
               }
            }
         } else {
            if(MacdCurrent < 0 && MacdCurrent > SignalCurrent && MacdPrevious < SignalPrevious && MathAbs(MacdCurrent) > (MACDCloseLevel*Point)) {
               if(!OrderClose(OrderTicket(),OrderLots(),Ask,3,Violet)) {
                  Print("OrderClose error ",GetLastError());
               }
               return(0);
            }

            if(TrailingStop > 0) {
               if((OrderOpenPrice()-Ask)>(Point*TrailingStop)) {
                  if((OrderStopLoss()>(Ask+Point*TrailingStop)) || (OrderStopLoss()==0)) {
                     if(!OrderModify(OrderTicket(),OrderOpenPrice(),Ask+Point*TrailingStop,OrderTakeProfit(),0,Red)) {
                        Print("OrderModify error ",GetLastError());
                     }
                     return(0);
                 }
               }
            }
         }
      }
   }
   return(0);
}`