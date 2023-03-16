import asyncio
import websockets as websockets

from threading import Thread
from AutoHotPy import AutoHotPy
from InterceptionWrapper import InterceptionMouseStroke, InterceptionMouseState

auto = AutoHotPy()


def rightButton(autohotpy):
    """
    This function simulates a right click
    """
    stroke = InterceptionMouseStroke()  # I highly suggest you to open InterceptionWrapper to read which attributes this class has

    # To simulate a mouse click we manually have to press down, and release the buttons we want.
    stroke.state = InterceptionMouseState.INTERCEPTION_MOUSE_RIGHT_BUTTON_DOWN
    autohotpy.sendToDefaultMouse(stroke)
    stroke.state = InterceptionMouseState.INTERCEPTION_MOUSE_RIGHT_BUTTON_UP
    autohotpy.sendToDefaultMouse(stroke)


def leftButton(autohotpy):
    """
    This function simulates a left click
    """
    stroke = InterceptionMouseStroke()
    stroke.state = InterceptionMouseState.INTERCEPTION_MOUSE_LEFT_BUTTON_DOWN
    autohotpy.sendToDefaultMouse(stroke)
    stroke.state = InterceptionMouseState.INTERCEPTION_MOUSE_LEFT_BUTTON_UP
    autohotpy.sendToDefaultMouse(stroke)


def mouse_move(autohotpy):
    async def echo(websocket):
        async for message in websocket:
            if message == 'l':
                leftButton(autohotpy)
            elif message == 'r':
                rightButton(autohotpy)
            else:
                deltax, deltay = (int(i) for i in message.split(' '))
                x, y = autohotpy.getMousePosition()
                autohotpy.moveMouseToPosition(x + deltax, y + deltay)

    async def main():
        loop = asyncio.get_event_loop()
        stop = loop.create_future()
        async with websockets.serve(echo, "0.0.0.0", 1337):
            await stop  # run forever

    asyncio.run(main())


def auto_target(autohotpy):
    autohotpy.exit_configured = True
    autohotpy.start()


move_mouse_thread = Thread(target=mouse_move, args=(auto,))
auto_thread = Thread(target=auto_target, args=(auto,))
auto_thread.start()
move_mouse_thread.start()
