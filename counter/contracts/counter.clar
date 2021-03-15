;; define counter variable
;; definition statements in clarity need to be at the top of the file
;; stored in the data space associated with the smart contract
;; persisted and acts as the global shared state
(define-data-var counter int 0)

;; increment method
;; being evaluates multiple expressinons; automatically returns the value of the last one
;; here it's used to set a new value and return the new value
(define-public (increment)
  (begin
    (var-set counter (+ (var-get counter) 17))
    (ok (var-get counter))))

;; decrement method
(define-public (decrement)
  (begin
    (var-set counter (- (var-get counter) 17))
    (ok (var-get counter))))

;; counter getter
;; provides access to the counter variable from outside of the smart contract
;; var-get looks for a variable in the contracts data space and returns it
(define-public (get-counter)
  (ok (var-get counter)))

;; read-only function calls don't require a transaction to complete
;; this is because the method doesn't require a state change