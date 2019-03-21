import { animate, state, style, transition, trigger } from '@angular/animations';

export const animateSnackBarStateTrigger = trigger('showSnackbarState', [
    state('void', style({})),
    state('*', style({})),
    transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
    ]),
    transition(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
    ])
]);
