# BikeShare Plan

## Linka / Bluetooth locking

After experimenting with the linka lock in person, we found some issues:
- Using bluetooth for locks is slow
- Using bluetooth introduces several security concerns
- Using bluetooth requires more integration work (For SG)

## Spin / Internet locking

This approach is definitely the most secure and future proof. The pros are:
- No need to wait for bluetooth pairing. Locking mechanism is practically instant for every rider
- Eliminates all of the security concerns associated with a bluetooth locking
- Integration requires no changes to mobile app, only server-side locking implementation
- Once an internet connected lock is produced (or a follow up EE sr project is done) the lock will be very easy to add





