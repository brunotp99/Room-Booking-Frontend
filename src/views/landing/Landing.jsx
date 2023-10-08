import React, { useState } from 'react';
import Phone from './images/mockup.png'
import MinhasReservas from './images/mockup3.jpg'
import Calendario from './images/mockup2.jpg'
import Disponivel from './images/tablet.jpg'
import AddReserva from './images/tablet2.jpg'
import Default from './images/default.jpg'
import Bruno from './images/bruno.jpg'
import Carlos from './images/carlos.jpg'
import Tiago from './images/tiago.jpg'
import Dashboard from './images/web1.jpg'
import PcMobile from './images/web2.jpg'

import { BsFillCalendarWeekFill } from 'react-icons/bs';
import { MdQrCode } from 'react-icons/md'
import { MdAndroid } from 'react-icons/md'
import { BiRightArrowAlt } from 'react-icons/bi'

import './styles.css'
import { urlBase } from '../../utils/Utils';

function Landing() {

  return (

        <div id="Landing">
            <header className='sticky top-0 z-50'>
                <nav class="border-gray-200 px-4 lg:px-6 py-2.5 bg-slate-800">
                    <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                        <a href="https://www.softinsa.pt/pt/" class="flex items-center p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="140" height="22" viewBox="0 0 140 22" fill="none">
                                <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="22">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0.176496H17.0695V21.2177H0V0.176496Z" fill="white"/>
                                </mask>
                                <g mask="url(#mask0)">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.2856 6.64662C12.1819 5.63724 11.7962 4.8852 11.1293 4.39066C10.4624 3.89682 9.46187 3.64885 8.12797 3.64885C5.66841 3.64885 4.43906 4.45049 4.43906 6.05254C4.43906 6.62685 4.69425 7.10674 5.20534 7.49221C5.71554 7.87803 6.53357 8.1996 7.65924 8.45711C8.99278 8.75344 10.15 9.03072 11.1293 9.28752C12.1089 9.5452 13.0055 9.84189 13.8182 10.1779C14.2759 10.3558 14.7087 10.5788 15.1152 10.8458C15.5217 11.1127 15.8655 11.4439 16.1471 11.84C16.4284 12.2359 16.652 12.7106 16.8191 13.2645C16.9854 13.8187 17.0695 14.4913 17.0695 15.2824C17.0695 16.2321 16.8601 17.0734 16.4447 17.8054C16.027 18.5371 15.4643 19.1557 14.756 19.6603C14.047 20.1642 13.2132 20.5509 12.2546 20.8178C11.2962 21.0845 10.285 21.2177 9.22246 21.2177C6.20023 21.2177 3.92851 20.6633 2.40729 19.556C0.885544 18.4485 0.0827595 16.8062 0 14.63H4.18866C4.20904 15.6385 4.64251 16.4356 5.48623 17.0184C6.33048 17.6026 7.38792 17.8945 8.65944 17.8945C10.0352 17.8945 11.077 17.6566 11.7859 17.1813C12.4946 16.7069 12.8488 16.0642 12.8488 15.2524C12.8488 14.9366 12.8072 14.6443 12.7235 14.3778C12.6401 14.1103 12.479 13.8683 12.2394 13.6496C11.9991 13.433 11.6707 13.2398 11.2546 13.0714C10.8371 12.9036 10.2953 12.7504 9.62846 12.6111C8.04468 12.2954 6.67463 11.9732 5.51777 11.6471C4.36091 11.3206 3.40732 10.915 2.65716 10.43C1.90701 9.94549 1.35463 9.35706 1.00038 8.66431C0.645595 7.97263 0.468557 7.09174 0.468557 6.02324C0.468557 5.21189 0.624861 4.45049 0.937823 3.73798C1.25025 3.02546 1.7298 2.40808 2.37575 1.88319C3.02134 1.35882 3.81881 0.943879 4.76762 0.636601C5.71554 0.330205 6.83537 0.176477 8.12797 0.176477C9.37823 0.176477 10.5044 0.330205 11.5046 0.636601C12.5047 0.943879 13.3649 1.37823 14.0838 1.94231C14.8028 2.50639 15.3603 3.18872 15.7566 3.99054C16.1517 4.79183 16.3708 5.67695 16.4126 6.64662H12.2856Z" fill="#FEFEFE"/>
                                </g>
                                <mask id="mask1" mask-type="alpha" maskUnits="userSpaceOnUse" x="19" y="0" width="21" height="22">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2891 0.176496H39.1724V21.2177H19.2891V0.176496Z" fill="white"/>
                                </mask>
                                <g mask="url(#mask1)">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M29.2626 17.6859C30.0331 17.6859 30.7627 17.553 31.4508 17.2853C32.1379 17.0184 32.7374 16.6134 33.2485 16.069C33.7587 15.5249 34.1599 14.8274 34.4516 13.9765C34.7431 13.1263 34.89 12.1177 34.89 10.9498C34.89 8.61512 34.4094 6.84399 33.4514 5.63729C32.493 4.43042 31.096 3.82698 29.2626 3.82698C27.428 3.82698 26.0213 4.43042 25.0418 5.63729C24.0616 6.84399 23.5722 8.61512 23.5722 10.9498C23.5722 13.2847 24.0668 14.9908 25.0571 16.069C26.0468 17.148 27.4489 17.6859 29.2626 17.6859M29.2626 21.2178C26.0528 21.2178 23.5878 20.3277 21.8686 18.5467C20.1494 16.7666 19.2891 14.2042 19.2891 10.8603C19.2891 9.19862 19.5083 7.70476 19.9458 6.37893C20.3834 5.0538 21.0291 3.93059 21.884 3.01105C22.7387 2.09062 23.7804 1.38905 25.0106 0.903868C26.2402 0.419036 27.657 0.176354 29.2626 0.176354C30.8456 0.176354 32.2582 0.419036 33.4984 0.903868C34.7382 1.38905 35.7752 2.09592 36.609 3.02552C37.4423 3.95618 38.078 5.08857 38.5162 6.42394C38.9539 7.7593 39.1724 9.26851 39.1724 10.9498C39.1724 14.3525 38.3229 16.9148 36.6246 18.6358C34.9255 20.3575 32.4716 21.2178 29.2626 21.2178" fill="#FEFEFE"/>
                                </g>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M64.7763 20.5357V4.27219H58.5234V0.829652H61.658H75.4055L72.35 4.27219H69.122V20.5357H64.7763Z" fill="#FEFEFE"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M75.4897 20.5357V4.27308L78.5464 0.829652H79.8352V20.5357H75.4897Z" fill="#FEFEFE"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M95.7306 20.5357L86.8519 7.29944V20.5357H82.8188V0.829652H87.4144L95.6678 13.5018V0.829652H99.7314V20.5357H95.7306Z" fill="#FEFEFE"/>
                                <mask id="mask2" mask-type="alpha" maskUnits="userSpaceOnUse" x="102" y="0" width="18" height="22">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M102.17 0.176496H119.239V21.2177H102.17V0.176496Z" fill="white"/>
                                </mask>
                                <g mask="url(#mask2)">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M114.457 6.64662C114.352 5.63724 113.967 4.8852 113.3 4.39066C112.633 3.89682 111.632 3.64885 110.299 3.64885C107.84 3.64885 106.61 4.45049 106.61 6.05254C106.61 6.62685 106.865 7.10674 107.376 7.49221C107.886 7.87803 108.704 8.1996 109.83 8.45711C111.163 8.75344 112.32 9.03072 113.3 9.28752C114.28 9.5452 115.175 9.84189 115.989 10.1779C116.447 10.3558 116.879 10.5788 117.286 10.8458C117.693 11.1127 118.036 11.4439 118.318 11.84C118.599 12.2359 118.822 12.7106 118.99 13.2645C119.156 13.8187 119.239 14.4913 119.239 15.2824C119.239 16.2321 119.031 17.0734 118.615 17.8054C118.197 18.5371 117.635 19.1557 116.926 19.6603C116.218 20.1642 115.384 20.5509 114.425 20.8178C113.467 21.0845 112.456 21.2177 111.392 21.2177C108.37 21.2177 106.099 20.6633 104.577 19.556C103.056 18.4485 102.253 16.8062 102.17 14.63H106.36C106.38 15.6385 106.814 16.4356 107.656 17.0184C108.501 17.6026 109.559 17.8945 110.83 17.8945C112.206 17.8945 113.247 17.6566 113.956 17.1813C114.665 16.7069 115.019 16.0642 115.019 15.2524C115.019 14.9366 114.977 14.6443 114.894 14.3778C114.811 14.1103 114.649 13.8683 114.41 13.6496C114.17 13.433 113.841 13.2398 113.425 13.0714C113.007 12.9036 112.466 12.7504 111.8 12.6111C110.215 12.2954 108.845 11.9732 107.688 11.6471C106.531 11.3206 105.578 10.915 104.828 10.43C104.077 9.94549 103.525 9.35706 103.17 8.66431C102.816 7.97263 102.639 7.09174 102.639 6.02324C102.639 5.21189 102.795 4.45049 103.108 3.73798C103.421 3.02546 103.9 2.40808 104.546 1.88319C105.192 1.35882 105.99 0.943879 106.938 0.636601C107.886 0.330205 109.006 0.176477 110.299 0.176477C111.549 0.176477 112.674 0.330205 113.675 0.636601C114.675 0.943879 115.535 1.37823 116.255 1.94231C116.973 2.50639 117.531 3.18872 117.927 3.99054C118.322 4.79183 118.541 5.67695 118.583 6.64662H114.457Z" fill="#FEFEFE"/>
                                </g>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M129.994 5.25197H129.964L127.307 13.0862H132.59L129.994 5.25197ZM135.153 20.5358L133.84 16.4697H126.181L124.712 20.5358H120.116L127.525 0.829528H132.558L139.874 20.5358H135.153Z" fill="#FEFEFE"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M46.035 12.2256V20.5357H41.6895V8.75341H46.035H55.1637V12.2256H46.035Z" fill="#FEFEFE"/>
                                <mask id="mask3" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="140" height="22">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 21.2177H139.874V0.176496H0V21.2177Z" fill="white"/>
                                </mask>
                                <g mask="url(#mask3)">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M41.6895 4.27225H56.4775V0.829704H41.6895V4.27225Z" fill="#FEFEFE"/>
                                </g>
                            </svg>
                        </a>
                        <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1 mt-3" id="mobile-menu-2">
                            <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                                <li className='borda p-2 px-4'>
                                    <a href="login" class="inline-block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white hover:text-blue-600" aria-current="page"><BiRightArrowAlt className='inline' /> Entrar</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                </nav>
            </header>

            <section class="bg-gray-900">
                <div class="grid py-8 px-4 mx-auto max-w-screen-xl lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                    <div class="place-self-center mr-auto lg:col-span-7">
                        <h1 class="mb-4 max-w-2xl text-4xl font-extrabold leading-none md:text-5xl xl:text-6xl text-white">Reserve uma sala à sua medida</h1>
                        <p class="mb-6 max-w-2xl font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl text-gray-400">Graças à nossa aplicação pode reservar uma sala em segundos garantindo a sua disponibilidade na data pretendida.</p>
                        <a href="#mobile" class="inline-flex justify-center items-center py-3 px-5 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 focus:ring-primary-900 hover:text-blue-600">
                            Obtenha já
                            <svg class="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        </a>
                    </div>
                    <div class="hidden lg:mt-0 lg:col-span-5 lg:flex Phone">
                        <img src={Phone} alt="mockup" />
                    </div>                
                </div>
            </section>

            <section class="bg-gray-50">
                <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                    <div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
                        <div>
                            <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
                                <BsFillCalendarWeekFill class="w-5 h-5 text-primary-600 lg:w-6 lg:h-6" />
                            </div>
                            <h3 class="mb-2 text-xl font-bold">Reservar Salas</h3>
                            <p class="text-gray-500">Através da aplicação mobile pode criar reservas, por sala ou por datas disponíveis e alterar ou cancelar as mesmas em qualquer momento.</p>
                        </div>
                        <div>
                            <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
                                <MdQrCode class="w-5 h-5 text-primary-600 lg:w-6 lg:h-6" />
                            </div>
                            <h3 class="mb-2 text-xl font-bold">Gerar QRCodes</h3>
                            <p class="text-gray-500">Pode gerar QRCodes nos tablets presentes a frente das salas podendo assim requisitar um intervalo de tempo com apenas um simples scan.</p>
                        </div>
                        <div>
                            <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
                                <MdAndroid class="w-5 h-5 text-primary-600 lg:w-6 lg:h-6" />
                            </div>
                            <h3 class="mb-2 text-xl font-bold">Compatibilidade</h3>
                            <p class="text-gray-500">As nossas aplicações são compatíveis com todos os dispositivos Android com um sistema operacional Lollipop ou superior (SDK 21+), ou seja, 98% dos dispositivos.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="mobile" class="bg-white">
                <div class="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
                    <div class="font-light text-gray-500 sm:text-lg">
                        <h2 class="mb-4 text-4xl font-extrabold text-gray-900">Aplicação Mobile</h2>
                        <p class="mb-4">Através da nossa aplicação mobile desenvolvida para dispositivos Android poderá <b>criar, gerir e descobrir</b> reservas com facilidade.</p>
                        <p>Participe nas reuniões dos outros colaboradores e personalize o seu perfil para poder ser identificado.</p>
                        <a href={urlBase() + "uploads/file/mobile"} class="box-border relative z-30 inline-flex items-center justify-center w-auto px-8 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-blue-600 rounded-md cursor-pointer group ring-offset-2 ring-1 ring-blue-300 ring-offset-blue-200 hover:ring-offset-blue-500 ease focus:outline-none hover:text-white">
                            <span class="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                            <span class="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                            <span class="relative z-20 flex items-center text-sm">
                            <svg class="relative w-5 h-5 mr-2 text-white hover:text-white" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m12 16 4-5h-3V4h-2v7H8z"></path><path d="M20 18H4v-7H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-2v7z"></path></svg>
                                Descarregar
                            </span>
                        </a>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mt-8">
                        <img class="w-full rounded-lg" src={MinhasReservas} alt="Minhas Reservas" />
                        <img class="mt-4 w-full rounded-lg lg:mt-10" src={Calendario} alt="Calendario" />
                    </div>
                </div>
            </section>

            <section class="bg-white">
                <div class="flex flex-col-reverse gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
                    <div class="grid grid-cols-2 gap-4 mt-8">
                        <img class="w-full rounded-lg" src={Disponivel} alt="Sala Disponivel" />
                        <img class="mt-4 w-full rounded-lg lg:mt-10" src={AddReserva} alt="Adiconar Reserva" />
                    </div>
                    <div class="font-light text-gray-500 sm:text-lg">
                        <h2 class="mb-4 text-4xl font-extrabold text-gray-900">Aplicação Tablet</h2>
                        <p class="mb-4">Esta aplicação foi projetada para tablets, com o objetivo de disponibilizar uma <b>visão semanal</b> das requisições de uma sala.</p>
                        <p>Graças a este sistema é possível encontrar intervalos de tempo disponíveis e através de um <b>QRCODE</b>, reservar o respetivo horário.</p>
                        <a href={urlBase() + "uploads/file/tablet"} class="box-border relative z-30 inline-flex items-center justify-center w-auto px-8 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-blue-600 rounded-md cursor-pointer group ring-offset-2 ring-1 ring-blue-300 ring-offset-blue-200 hover:ring-offset-blue-500 ease focus:outline-none hover:text-white">
                            <span class="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                            <span class="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                            <span class="relative z-20 flex items-center text-sm">
                            <svg class="relative w-5 h-5 mr-2 text-white hover:text-white" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m12 16 4-5h-3V4h-2v7H8z"></path><path d="M20 18H4v-7H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-2v7z"></path></svg>
                                Descarregar
                            </span>
                        </a>
                    </div>
                </div>
            </section>

            <section class="bg-white">
                <div class="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
                    <div class="font-light text-gray-500 sm:text-lg">
                        <h2 class="mb-4 text-4xl font-extrabold text-gray-900">Dashboard</h2>
                        <p class="mb-4">A dashboard é exclusiva aos gestores dos espaços, esta permite <b>gerenciar todo o sistema</b>.</p>
                        <p>Existem dois niveis de gestores, cada um com permissões diferentes. Disponibilizamos entre outras um <b>calendário</b> para uma gestão mais eficiente das reservas e um sistema de <b>logging</b> para estar sempre a par das alterações.</p>
                        <a href="login" class="box-border relative z-30 inline-flex items-center justify-center w-auto px-8 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-blue-600 rounded-md cursor-pointer group ring-offset-2 ring-1 ring-blue-300 ring-offset-blue-200 hover:ring-offset-blue-500 ease focus:outline-none hover:text-white">
                            <span class="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                            <span class="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                            <span class="relative z-20 flex items-center text-sm">
                            <svg class="relative w-5 h-5 mr-2 text-white hover:text-white" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z"></path></svg>
                                Entrar
                            </span>
                        </a>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mt-8">
                        <img class="w-full rounded-lg" src={Dashboard} alt="Dashboard" />
                        <img class="mt-4 w-full rounded-lg lg:mt-10" src={PcMobile} alt="Calendario e Utilizadores" />
                    </div>
                </div>
            </section>

            <section class="bg-white">

                <div className='py-8 px-4 mx-auto max-w-screen-xl'>
                    <h2 class="mb-4 text-4xl font-extrabold text-gray-900">Sobre Nós</h2>
                    <p class="mb-4">A aplicação foi desenvolvida pela nossa equipa, constituida por 3 elementos. Todos os membros foram trabalhando todas as partes do projeto mas o foco principal de cada um foi o seguinte:</p>
                </div>

                <div class="flex flex-col mx-auto justify-center items-center gap-16 sm:flex-row">

                    <div className='w-44 text-center'>
                        <img src={Bruno} className="w-full rounded-full p-3" />
                        <h1 className='font-extrabold'>Bruno Pinto</h1>
                        <p>Fullstack / Mobile</p>
                    </div>

                    <div className='w-44 text-center'>
                        <img src={Carlos} className="w-full rounded-full p-3" />
                        <h1 className='font-extrabold'>Carlos Silva</h1>
                        <p>Frontend / Documentação</p>
                    </div>

                    <div className='w-44 text-center'>
                        <img src={Tiago} className="w-full rounded-full p-3" />
                        <h1 className='font-extrabold'>Tiago Martins</h1>
                        <p>Designer / Base de Dados</p>
                    </div>

                </div>
            </section>

            <footer class="p-4 bg-gray-50 sm:p-6">
                <div class="mx-auto max-w-screen-xl">
                    <hr class="my-6 border-gray-200 sm:mx-auto lg:my-8" />
                    <div class="sm:flex sm:items-center sm:justify-between">
                        <span class="text-sm text-gray-500 sm:text-center">© <a href="https://www.softinsa.pt/pt/" class="hover:underline">Softinsa</a> 2022. Todos os direitos reservados
                        </span>
                        <div class="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
                            <a href="https://www.facebook.com/Softinsa/" class="text-gray-500 hover:text-gray-900">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" /></svg>
                            </a>
                            <a href="https://www.instagram.com/softinsa/" class="text-gray-500 hover:text-gray-900">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" /></svg>
                            </a>
                            <a href="https://pt.linkedin.com/company/softinsa" class="text-gray-500 hover:text-gray-900">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 28 28" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
            
        </div>

  )

}

export default Landing