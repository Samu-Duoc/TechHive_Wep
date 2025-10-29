import { render, screen, fireEvent } from "@testing-library/react";
import Contacto from "../pages/contacto";
import { vi } from "vitest";

describe("Contacto component", () => {
    it("renderiza los campos correctamente", () => {
    render(<Contacto />);
    expect(screen.getByTestId("nombre-input")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("mensaje-textarea")).toBeInTheDocument();
    });

    it("envía el formulario y limpia los campos", () => {
    render(<Contacto />);
    const nombreInput = screen.getByTestId("nombre-input");
    const emailInput = screen.getByTestId("email-input");
    const mensajeTextarea = screen.getByTestId("mensaje-textarea");
    const submitButton = screen.getByTestId("submit-button");

    // Mock para alert
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    fireEvent.change(nombreInput, { target: { value: "Samuel" } });
    fireEvent.change(emailInput, { target: { value: "samuel@test.com" } });
    fireEvent.change(mensajeTextarea, { target: { value: "Hola, soy Samuel" } });

    fireEvent.click(submitButton);

    expect(alertMock).toHaveBeenCalledWith(
        "Gracias Samuel, tu mensaje ha sido enviado!"
    );

    // Verificar que se limpien los campos
    expect((nombreInput as HTMLInputElement).value).toBe("");
    expect((emailInput as HTMLInputElement).value).toBe("");
    expect((mensajeTextarea as HTMLTextAreaElement).value).toBe("");

    alertMock.mockRestore();
    });
});
