import '../css/SocialWrapper.css';
import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Set, Get } from '../utils/storageUtil';

const browser = getBrowser();
const reviewLink = getReviewLink();
const twitterLink = 'https://twitter.com/intent/tweet?text=Hey, I recommend COVID-19 Tracker extension to get updates on the coronavirus infected patients stats within browser. Stay Home, Stay Safe.&url=https://coronatrends.live&hashtags=extensions,COVID_19&via=_coronatrends_';
const facebookLink = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcoronatrends.live&quote=%EF%B8%8F%20Hey%2C%20I%20recommend%20COVID-19%20Tracker%20extension%20to%20get%20updates%20on%20the%20coronavirus%20infected%20patients%20stats%20within%20browser.%20Stay%20Home%2C%20Stay%20Safe.&display=page';

const Storage = {
    REVIEW_SEEN: 'review_seen',
    SHARE_SEEN: 'share_seen',
};
/*global chrome*/
function getBrowser() {
    return navigator.userAgent.indexOf('firefox') > -1 ? 'Firefox' : 'Chrome';
}

function getReviewLink() {
    if (browser === 'Chrome') {
        return 'https://bit.ly/coronatrends-chrome';
    } else {
        return 'https://bit.ly/coronatrends-firefox';
    }
}

function SocialWrapper() {
    const [isPopupVisible, setPopup] = useState(false);
    // const [show, setShow] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [showShare, setShowShare] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            const now = +new Date();
            if (Get(Storage.REVIEW_SEEN) && now > Get(Storage.REVIEW_SEEN)) {
                setPopup(true);
                setShowReview(true);
            } else if (Get(Storage.SHARE_SEEN) && now > Get(Storage.SHARE_SEEN)) {
                setPopup(true);
                setShowShare(true);
            }
            // setShowReview(true);
            // setShowShare(true);
        }, 100);
    }, []);

    function closeReview(event) {
        event.stopPropagation();
        const now = +new Date();
        Set(Storage.REVIEW_SEEN, now + 432000000);
        setShowReview(false);
    }

    function onReviewClick(event) {
        event.stopPropagation();
        Set(Storage.REVIEW_SEEN, +new Date('2020-12-01'));
        chrome.tabs.create({url: reviewLink});
        setShowReview(false);
    }
    function onTwitterClick(event) {
        event.stopPropagation();
        chrome.tabs.create({url: encodeURI(twitterLink)});
        Set(Storage.SHARE_SEEN, +new Date('2020-12-01'));
        setShowShare(false);
    }
    function onFacebookClick(event) {
        event.stopPropagation();
        chrome.tabs.create({url: encodeURI(facebookLink)});
        Set(Storage.SHARE_SEEN, +new Date('2020-12-05'));
        setShowShare(false);
    }
    function onCloseShare(event) {
        event.stopPropagation();
        const now = +new Date();
        Set(Storage.SHARE_SEEN, now + 432000000);
        setShowShare(false);
    }

    if (!isPopupVisible) {
        return null;
    }

    return (
        <div className='social-popup flex flex-column justify-center align-middle'>
            <CSSTransition
                in={showReview || showShare}
                appear
                unmountOnExit
                timeout={1000}
                classNames='fade-slow'
                onExited={() => {
                    setPopup(false);
                }}>
                <div
                    className='social-overlay'
                    onClick={(event) => {
                        closeReview(event);
                        onCloseShare(event);
                    }}
                />
            </CSSTransition>
            <CSSTransition
                in={showReview}
                appear
                unmountOnExit
                timeout={{
                    appear: 2000,
                    enter: 2000,
                    exit: 750,
                }}
                classNames='bounce'>
                <div className='social-wrapper'>
                    <div className='social-bg' />
                    <div className='social-heading bold'>Share your valuable feedback</div>
                    <div className='social-subheading'>
                        We have worked super hard to come up with this tool. We would request you to
                        spare a minute to rate us on {browser} store.
                    </div>
                    <div className='social-buttons flex justify-center'>
                        <button
                            className='review-button social-chrome flex justify-center align-middle bold'
                            onClick={onReviewClick}>
                            {browser === 'Chrome' ? (
                                <svg
                                    width='24'
                                    height='24'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='social-icon'>
                                    <path
                                        d='M12 15.984a3.984 3.984 0 100-7.968 3.984 3.984 0 000 7.968z'
                                        fill='#fff'
                                    />
                                    <path
                                        d='M6.734 10.847A5.4 5.4 0 0112 6.61h10.728a12.026 12.026 0 00-2.243-3.094A11.922 11.922 0 0012 0a11.922 11.922 0 00-8.485 3.515c-.218.218-.426.443-.625.674l3.844 6.658z'
                                        fill='#fff'
                                    />
                                    <path
                                        d='M13.635 17.137a5.394 5.394 0 01-6.337-2.5l-5.329-9.23A11.917 11.917 0 000 12c0 3.206 1.248 6.219 3.515 8.485a11.913 11.913 0 006.275 3.312l3.845-6.66z'
                                        fill='#fff'
                                    />
                                    <path
                                        d='M15.627 8.016a5.378 5.378 0 011.024 6.705l-.014.027-5.33 9.232a11.922 11.922 0 009.177-3.494A11.922 11.922 0 0024 12c0-1.378-.23-2.721-.674-3.984h-7.698z'
                                        fill='#fff'
                                    />
                                </svg>
                            ) : (
                                <svg
                                    width='24'
                                    height='24'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'>
                                    <g clip-path='url(#clip0)' fill='#fff'>
                                        <path d='M.012 10.033v-.007c-.013.098-.019.137 0 .007zM.012 10.026v.001-.002.001z' />
                                        <path d='M23.796 9.088c-.108.825-.225 1.25-.344 1.278 0 0-.042-4.412-1.506-5.876.25 2.573.003 1.536.003 1.548C19.963 2.612 16.256.3 12.02.3a11.457 11.457 0 00-8.813 4.132 1.804 1.804 0 01-.058-.052c-.33-.302-.519-1.75-.519-1.75 0-.005-.003-.009-.003-.013L2.624 2.6c0-.002 0-.005-.002-.009-.004.003-.005.007-.01.01l-.01.012c-.005.004-.007.01-.011.014l-.012.013a.042.042 0 01-.011.013c-.005.004-.008.01-.011.013-.005.005-.008.01-.014.013-.003.006-.007.01-.01.014l-.013.014-.01.013-.012.013c-.004.005-.007.01-.012.013a.07.07 0 01-.012.015s-.616.81-.834 1.69c-.145.699-.002.01-.004.012l-.002.016-.003.013h-.002c-.182.725-.271 1.588-.26 2.6-.008.009-.017.015-.023.024 0 0-1.085 1.176-1.265 2.435a63.162 63.162 0 01-.07.488c-.002.037-.006.074-.007.112.003-.006.008-.011.01-.017.003.095.013.188.037.274l.651-.53c-.008.063-.022.123-.03.187a8.013 8.013 0 00-.428 1.807c-.214 1.93.202 3.842 1.233 5.734 0 0 .413.743.665 1.096.032.05.06.1.096.15l.007.002C4.4 21.795 7.852 23.7 11.747 23.7c3.447 0 6.544-1.493 8.704-3.872l.042.002c.143-.175.274-.354.41-.53.359-.446.691-.917.986-1.412l-.028.002c.924-1.515 1.53-3.077 1.805-4.69.396-1.589.44-2.96.13-4.113zM3.191 4.451a.074.074 0 01-.007-.012.11.11 0 01-.01-.015l-.01-.014c-.001-.005-.005-.01-.007-.016l.046.04c-.003.007-.007.012-.012.017zm17.297 4.113a1.725 1.725 0 00-.978-.753c.51 1.978.56 3.61.147 4.897-.282-.858-.542-1.373-.774-1.553.322 2.648-.114 4.608-1.306 5.885.227-.779.317-1.418.265-1.92-1.4 2.096-2.994 3.18-4.777 3.249a6.705 6.705 0 01-2-.317l-.038-.002a3.614 3.614 0 01-.183-.066l-.001-.001a3.803 3.803 0 01-.31-.13c-.05-.024-.1-.044-.15-.07-.048-.023-.095-.049-.144-.073-.047-.023-.097-.047-.142-.072-.046-.024-.09-.052-.134-.079a2.266 2.266 0 01-.134-.079 1.974 1.974 0 01-.13-.081c-.043-.027-.083-.056-.125-.085l-.126-.085-.117-.09c-.039-.03-.08-.06-.117-.09a3.243 3.243 0 01-.114-.094c-.038-.03-.074-.063-.111-.094-.037-.03-.074-.062-.11-.096-.036-.03-.07-.066-.105-.099a2.173 2.173 0 01-.103-.098l-.082-.078c.011.002.022.002.033.002l.082.006.081.003.08.005c.028.002.054.004.08.004.028.001.055.004.081.004.029 0 .057-.002.085 0 .027 0 .055-.003.083-.003h.084l.083-.001.083-.002.086-.007.088-.006.083-.008c.03-.002.059-.003.087-.006l.088-.01c.03-.003.06-.01.09-.014l.087-.013c.03-.003.059-.009.088-.012.03-.006.06-.009.09-.014l.09-.02.092-.02c.032-.008.063-.014.092-.022.031-.007.063-.012.092-.02l.094-.025.095-.029c.033-.009.065-.017.097-.027.03-.01.063-.018.094-.028.033-.01.066-.023.098-.034.033-.013.068-.024.1-.037l.1-.038c.032-.013.066-.023.1-.037l.103-.048.105-.049c.035-.016.07-.03.105-.047.015-.009.033-.014.047-.023l.065-.042.116-.076.117-.075.118-.075.117-.076.117-.075.117-.076.117-.075.117-.076.115-.076.118-.075.117-.075.116-.076.054-.034-.004-.006a.696.696 0 01.565.017c.372-.052.503-.25.378-.582-.18-.249-.453-.474-.801-.671-.764-.397-1.559-.334-2.39.191-.79.446-1.552.43-2.293-.045-.486-.333-.955-.78-1.405-1.34l-.182-.263c-.002.01-.002.022-.002.031 0-.01 0-.022.002-.034v-.005l.001-.023a1.51 1.51 0 01.07-.385.802.802 0 01.146-.267.704.704 0 01.319-.214c.05-.015.102-.027.157-.036-.032-.003-.058-.004-.089-.008-.083-.006-.156-.014-.224-.02a16.678 16.678 0 00-.336-.025c-.04-.003-.08-.004-.12-.008-.063-.002-.124-.006-.185-.01-.018 0-.029-.003-.047-.004-.07-.004-.13-.01-.182-.017.07 0 .14-.002.208 0 .1.005.202.01.304.017.115.006.334.023.648.05.5.047 1.07.16 1.713.345.107-.616-.034-1.26-.424-1.92v-.011a.924.924 0 00-.142-.22.612.612 0 01.14.198c.008.015.019.028.024.044.018-.017.034-.029.052-.045l.076-.069c.026-.023.05-.045.077-.067l.077-.068.075-.07c.025-.02.05-.044.075-.067.027-.022.051-.04.077-.063.026-.022.051-.04.077-.06.026-.023.051-.042.076-.063l.075-.062.077-.061c.025-.021.052-.04.077-.06l.076-.055c.026-.02.052-.036.076-.055l.078-.056c.025-.017.05-.037.076-.053l.076-.052.077-.049.077-.047c.025-.014.05-.031.076-.047l.075-.048a.119.119 0 00.02-.012c.021-.012.038-.025.059-.038.025-.017.052-.032.075-.051.03-.024.053-.052.078-.08a.752.752 0 00.152-.322c.005-.006.01-.012.016-.012l.005-.005a45.6 45.6 0 01.022-.022c.12-.175.08-.317-.124-.44-.421.021-1.266-.074-1.276-.075l-.016-.006C8.693 7.013 8.14 6.133 8.14 6.133c0 .005-.024-.025-.024-.025l-.031-.041.005-.005.013-.008.011-.008.011-.009c.005-.003.01-.005.012-.009h.003l.002-.01a.047.047 0 00.002-.012.03.03 0 01.003-.013c0-.003-.016.016.002-.012-.189-1.53 1.82-2.536 1.82-2.536s-2.416.676-3.168 1.554l-.111.008.1.002a.038.038 0 01-.01.006l-.009.011-.01.01-.005.002-.017-.005-.045-.013c-1.458-.352-2.654.175-2.654.175-.008 0-.016.004-.023.006l-.023.01-.024.007a.253.253 0 01-.02.007 1.602 1.602 0 01-.57-.486A11.125 11.125 0 0112.02.63c2.691 0 5.162.96 7.09 2.555a6.208 6.208 0 00-.98-.39c-.98-.292-2.15-.461-3.5-.5.591.117 1.095.265 1.5.45.024.007.05.018.072.023.573.272.957.612 1.138 1.012-.581-.107-1.108-.067-1.57.113 3.322 1.31 4.898 2.869 4.719 4.672z' />
                                        <path d='M.07 9.6c-.03.14-.045.275-.053.404l.06-.427A.091.091 0 00.07 9.6zM.016 10.003c0 .008-.002.015-.003.022v-.002l.003-.02z' />
                                    </g>
                                    <defs>
                                        <clipPath id='clip0'>
                                            <path fill='#fff' d='M0 0h24v24H0z' />
                                        </clipPath>
                                    </defs>
                                </svg>
                            )}
                            <span>Review Us</span>
                        </button>
                    </div>
                    <div className='social-close' onClick={closeReview}>
                        <span>May be later</span>
                    </div>
                </div>
            </CSSTransition>

            <CSSTransition
                in={showShare}
                appear
                unmountOnExit
                timeout={{
                    appear: 2000,
                    enter: 2000,
                    exit: 750,
                }}
                classNames='bounce'>
                <div className='social-wrapper'>
                    <div className='share-bg' />
                    <div className='social-heading bold'>Find Covid-19 Tracker useful?</div>
                    <div className='social-subheading'>
                        We have worked hard in building this tool, please help us spread the word on
                        social media.
                    </div>
                    <div className='social-buttons flex flex-column align-middle'>
                        <button
                            className='review-button flex justify-center align-middle bold social-twitter'
                            onClick={onTwitterClick}>
                            <svg
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                                className='social-icon'>
                                <g clip-path='url(#clip0)'>
                                    <path
                                        d='M24 4.5585C23.1075 4.95 22.1565 5.2095 21.165 5.3355C22.185 4.7265 22.9635 3.7695 23.3295 2.616C22.3785 3.183 21.3285 3.5835 20.2095 3.807C19.3065 2.8455 18.0195 2.25 16.6155 2.25C13.8915 2.25 11.6985 4.461 11.6985 7.1715C11.6985 7.5615 11.7315 7.9365 11.8125 8.2935C7.722 8.094 4.1025 6.1335 1.671 3.147C1.2465 3.8835 0.9975 4.7265 0.9975 5.634C0.9975 7.338 1.875 8.8485 3.183 9.723C2.3925 9.708 1.617 9.4785 0.96 9.117C0.96 9.132 0.96 9.1515 0.96 9.171C0.96 11.562 2.6655 13.548 4.902 14.0055C4.5015 14.115 4.065 14.1675 3.612 14.1675C3.297 14.1675 2.979 14.1495 2.6805 14.0835C3.318 16.032 5.127 17.4645 7.278 17.511C5.604 18.8205 3.4785 19.6095 1.1775 19.6095C0.774 19.6095 0.387 19.5915 0 19.542C2.1795 20.9475 4.7625 21.75 7.548 21.75C16.602 21.75 21.552 14.25 21.552 7.749C21.552 7.5315 21.5445 7.3215 21.534 7.113C22.5105 6.42 23.331 5.5545 24 4.5585Z'
                                        fill='white'
                                    />
                                </g>
                                <defs>
                                    <clipPath id='clip0'>
                                        <rect width='24' height='24' fill='white' />
                                    </clipPath>
                                </defs>
                            </svg>

                            <span>Share on Twitter</span>
                        </button>
                        <button
                            className='review-button flex justify-center align-middle bold social-facebook'
                            style={{ marginTop: '10px' }}
                            onClick={onFacebookClick}>
                            <svg
                                width='24'
                                height='24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                                className='social-icon'>
                                <path
                                    d='M15.363 5.32h1.825V2.14a23.577 23.577 0 00-2.66-.14c-2.632 0-4.436 1.656-4.436 4.7v2.8H7.188v3.555h2.905V22h3.562v-8.944h2.788l.442-3.555h-3.23V7.05c0-1.027.277-1.73 1.709-1.73z'
                                    fill='#fff'
                                />
                            </svg>
                            <span>Share on Facebook</span>
                        </button>
                    </div>
                    <div className='social-close' onClick={onCloseShare}>
                        <span>May be later</span>
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
}

export default React.memo(SocialWrapper);
