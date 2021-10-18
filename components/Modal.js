import { Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";

export default function Modal({ showDialog, setShowDialog }) {
  return (
    <Transition appear show={showDialog} as={Fragment}>
      <Dialog
        onClose={() => setShowDialog(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-700 bg-opacity-80" />
          </Transition.Child>
          <span
            className="inline-block h-screen align-middle sca"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500 transform"
            enterFrom="opacity-0 translate-y-4 "
            enterTo="opacity-100 translate-y-0 "
            leave="ease-in duration-200 transform"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-4 "
          >
            <div className="relative max-w-xl p-8 mx-auto bg-white shadow-2xl rounded-xl">
              <Dialog.Title>Teste</Dialog.Title>

              <Dialog.Description>
                {" "}
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum
                tenetur ex perferendis eligendi aut illum minima dolores
                delectus iure, qui iste aliquam quod totam. Saepe sapiente
                molestias maxime dolorum est.
              </Dialog.Description>

              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde,
                sequi ad. Dolore amet aperiam pariatur.
              </p>
              <p>
                Obcaecati non nam architecto aperiam maiores omnis. Temporibus
                numquam consectetur adipisci blanditiis, provident quidem sequi!
              </p>
              <p>
                Sit itaque blanditiis tempore quae exercitationem qui, veritatis
                nesciunt quo odio, asperiores labore dolor voluptate?
              </p>

              <button
                className="button button-small button-ghost"
                onClick={() => setShowDialog(false)}
              >
                Fechar
              </button>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
