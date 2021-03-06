import { guid } from '../core/Core';
import '../core/Object';  // For Object.keyOf
import '../foundation/RunLoop';  // For Function#invokeInRunLoop
import UA from '../ua/UA';

/**
    Object: O.CSSStyleAnimationController

    Monitors for transitionend events and notifies the relevant
    CSSStyleAnimation class that its animation has finished.
    There is normally no reason to interact with this object directly.
*/
const CSSStyleAnimationController = {
    /**
        Property: O.CSSStyleAnimationController.animations
        Type: Object

        Maps elements (by guid) to transitions currently occurring on them.
    */
    animations: {},

    /**
        Method: O.CSSStyleAnimationController.register

        Associates an element with the <O.CSSStyleAnimation> object that is
        managing its animation.

        Parameters:
            el        - {Element} The element being animated.
            animation - {O.CSSStyleAnimation} The animation controller.
    */
    register ( el, animation ) {
        this.animations[ guid( el ) ] = animation;
    },

    /**
        Method: O.CSSStyleAnimationController.deregister

        Removes an element and its animation controller from the <#animations>
        map.

        Parameters:
            el - {Element} The element that was being animated.
    */
    deregister ( el ) {
        delete this.animations[ guid( el ) ];
    },

    /**
        Method: O.CSSStyleAnimationController.handleEvent

        Handles the transitionend event. Notifies the relevant animation
        controller that the transition has finished.

        Parameters:
            event - {Event} The transitionend event object.
    */
    handleEvent: function ( event ) {
        const animation = this.animations[ guid( event.target ) ];
        const property = event.propertyName;
        if ( animation ) {
            event.stopPropagation();
            animation.transitionEnd(
                Object.keyOf( UA.cssProps, property ) || property,
                event.elapsedTime
            );
        }
    }.invokeInRunLoop(),
};

[ 'transitionend', 'webkitTransitionEnd', 'oTransitionEnd' ].forEach( type => {
    document.addEventListener( type, CSSStyleAnimationController, true );
});

export default CSSStyleAnimationController;
