import { useCallback } from 'react';
import { WebViewMessageEvent } from 'react-native-webview';

const PAYSTACK_PUBLIC_KEY = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

export function usePaystack() {
  const initializePayment = useCallback(
    (
      email: string,
      amount: number,
      reference: string,
      onSuccess: (reference: string) => void,
      onError: (error: string) => void
    ) => {
      return {
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script src="https://js.paystack.co/v1/inline.js"></script>
          </head>
          <body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:transparent;">
            <script>
              PaystackPop.setup({
                key: '${PAYSTACK_PUBLIC_KEY}',
                email: '${email}',
                amount: ${amount * 100},
                ref: '${reference}',
                onClose: function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'closed' }));
                },
                callback: function(response) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'success', reference: response.reference }));
                }
              }).openIframe();
            </script>
          </body>
          </html>
        `,
        onMessage: (event: WebViewMessageEvent) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.status === 'success') {
              onSuccess(data.reference);
            } else if (data.status === 'closed') {
              onError('Payment cancelled');
            }
          } catch {
            onError('Payment error');
          }
        },
      };
    },
    []
  );

  const initializeSubscription = useCallback(
    (
      email: string,
      planCode: string,
      reference: string,
      onSuccess: (reference: string) => void,
      onError: (error: string) => void
    ) => {
      return {
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script src="https://js.paystack.co/v1/inline.js"></script>
          </head>
          <body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:transparent;">
            <script>
              PaystackPop.setup({
                key: '${PAYSTACK_PUBLIC_KEY}',
                email: '${email}',
                plan: '${planCode}',
                ref: '${reference}',
                onClose: function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'closed' }));
                },
                callback: function(response) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'success', reference: response.reference }));
                }
              }).openIframe();
            </script>
          </body>
          </html>
        `,
        onMessage: (event: WebViewMessageEvent) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.status === 'success') {
              onSuccess(data.reference);
            } else if (data.status === 'closed') {
              onError('Payment cancelled');
            }
          } catch {
            onError('Payment error');
          }
        },
      };
    },
    []
  );

  // ─── Web: open Paystack inline checkout directly in the page ───
  // (react-native-webview's postMessage bridge doesn't exist on web,
  // but Paystack's inline.js runs natively in browsers.)
  const payOnWeb = useCallback(
    (email: string, amount: number, reference: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const w = globalThis as any;
        if (!w.window || !w.document) {
          reject(new Error('Web payments require a browser'));
          return;
        }
        if (!PAYSTACK_PUBLIC_KEY) {
          reject(new Error('Paystack public key is not configured'));
          return;
        }

        const openCheckout = () => {
          try {
            w.PaystackPop.setup({
              key: PAYSTACK_PUBLIC_KEY,
              email,
              amount: amount * 100,
              ref: reference,
              onClose: () => reject(new Error('Payment cancelled')),
              callback: (response: any) => resolve(response.reference),
            }).openIframe();
          } catch (err) {
            reject(err instanceof Error ? err : new Error('Payment failed'));
          }
        };

        if (w.PaystackPop) {
          openCheckout();
          return;
        }
        const script = w.document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        script.onload = openCheckout;
        script.onerror = () => reject(new Error('Could not load Paystack checkout'));
        w.document.body.appendChild(script);
      });
    },
    []
  );

  return {
    initializePayment,
    initializeSubscription,
    payOnWeb,
  };
}
